import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { spawn } from 'child_process';
import fs from 'fs-extra';
import { PrismaService } from 'nestjs-prisma';
import sharp from 'sharp';

import { CreateMediaDto } from './dto/create-media.dto';
import { MediaEntity } from './entities/media.entity';

export const ORIGINAL_FILENAME = 'original';
export const THUMBNAIL_FILENAME = 'thumbnail.webp';
export const THUMBNAIL_WIDTH = 400;

@Injectable()
export class MediaService {
  private logger: Logger = new Logger(MediaService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get a media by its id
   * @param mediaId - The media id
   * @returns The media
   */
  async getMedia(mediaId: string): Promise<MediaEntity> {
    this.logger.verbose(`📂 Getting media "${mediaId}"`);
    try {
      // Get the media
      const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
      this.logger.debug(`✅️ Got media "${mediaId}"`);
      return media;
    } catch (error) {
      this.logger.error(error.message);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Create a new media
   * @param data - The media data
   * @returns The created media
   */
  async createMedia(data: CreateMediaDto): Promise<MediaEntity> {
    this.logger.verbose(`📂 Creating media`);
    try {
      // Create the media
      const media = await this.prisma.media.create({
        data: {
          id: data.id,
          name: data.name,
          url: data.url,
          thumbnailUrl: data.thumbnailUrl,
          width: data.width,
          height: data.height,
          size: data.size,
          format: data.format,
          extension: data.extension,
          createdById: data.createdById,
        },
      });
      this.logger.debug(`✅️ Created media "${media.id}"`);
      return media;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete a media
   * @param mediaId - The media id
   * @returns The deleted media
   */
  async deleteMedia(mediaId: string): Promise<MediaEntity> {
    this.logger.verbose(`📂 Deleting media "${mediaId}"`);
    try {
      // Delete the media
      const media = await this.prisma.media.delete({ where: { id: mediaId } });
      this.logger.debug(`✅️ Deleted media "${mediaId}"`);
      return media;
    } catch (error) {
      this.logger.error(`🚨 Media "${mediaId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Generate a thumbnail for a media item
   * @param filePath - The temporary file's path
   * @param thumbnailPath - The generated thumbnail's path
   * @returns Thumbnail path
   */
  async generateThumbnail(filePath: string, thumbnailPath: string): Promise<unknown> {
    this.logger.verbose(`📂 Generating thumbnail for file "${filePath}"`);

    // Check that the file exists
    if (!(await fs.stat(filePath))) {
      throw new NotFoundException(`File "${filePath}" not found`);
    }

    // Get the file's metadata
    const metadata = await this.getMetadata(filePath);

    if (metadata['MIMEType'].startsWith('image/')) {
      // If the file is an image, use sharp to generate the thumbnail
      return sharp(filePath, { limitInputPixels: false }).resize(THUMBNAIL_WIDTH).webp().toFile(thumbnailPath);
    } else {
      // If the file is a video, use ffmpeg to generate the thumbnail
      const args = [
        '-y',
        `-i ${filePath}`,
        '-vframes 1',
        '-ss 00:00:00',
        `-vf scale=${THUMBNAIL_WIDTH}:-1`,
        thumbnailPath,
      ];
      const ffmpeg = spawn('ffmpeg', args, { shell: true });

      return new Promise((resolve, reject) => {
        let stderr = '';

        ffmpeg.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        ffmpeg.stderr.on('error', (error) => {
          reject(error);
        });

        ffmpeg.on('exit', (code) => {
          if (code !== 0) {
            this.logger.error('🚨 Failed to generate thumbnail');
            const error = new Error(`ffmpeg exited ${code}\nffmpeg stderr:\n\n${stderr}`);
            reject(error);
          }
          if (stderr.includes('nothing was encoded')) {
            this.logger.error('🚨 Failed to generate thumbnail');
            const error = new Error(`ffmpeg failed to encode file\nffmpeg stderr:\n\n${stderr}`);
            reject(error);
          }
        });

        ffmpeg.on('close', (data) => {
          this.logger.debug(`✅️ Generated thumbnail for file "${filePath}"`);
          resolve(data);
        });
      });
    }
  }

  /**
   * Get metadata of media file using ExifTool CLI
   * @param filePath - The temporary file's path
   * @returns Metadata
   */
  async getMetadata(filePath: string): Promise<unknown> {
    this.logger.verbose(`📂 Getting metadata for file "${filePath}"`);

    // Check that the file exists
    if (!(await fs.stat(filePath))) {
      throw new NotFoundException(`File "${filePath}" not found`);
    }

    const args = ['-json', filePath];
    const exiftool = spawn('exiftool', args, { shell: true });

    return new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';

      exiftool.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      exiftool.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      exiftool.stderr.on('error', (error) => {
        reject(error);
      });

      exiftool.on('exit', (code) => {
        if (code !== 0) {
          this.logger.error('🚨 Failed to get metadata');
          const error = new Error(`exiftool exited ${code}\nexiftool stderr:\n\n${stderr}`);
          reject(error);
        }
      });

      exiftool.on('close', () => {
        this.logger.debug(`✅️ Got metadata for file "${filePath}"`);
        resolve(JSON.parse(stdout)[0]);
      });
    });
  }
}
