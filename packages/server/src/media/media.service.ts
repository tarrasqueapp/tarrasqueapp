import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { spawn } from 'child_process';
import { stat } from 'fs-extra';
import { PrismaService } from 'nestjs-prisma';

import { config } from '../config';
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
   * @param createdById - The user id
   * @returns The created media
   */
  async createMedia(data: CreateMediaDto, createdById: string): Promise<MediaEntity> {
    this.logger.verbose(`📂 Creating media`);
    try {
      // Create the media
      const media = await this.prisma.media.create({
        data: {
          id: data.id,
          url: data.url,
          thumbnailUrl: data.thumbnailUrl,
          width: data.width,
          height: data.height,
          size: data.size,
          format: data.format,
          extension: data.extension,
          createdBy: { connect: { id: createdById } },
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
    if (!(await stat(filePath))) {
      throw new NotFoundException(`File "${filePath}" not found`);
    }

    const height = -1;

    const args = [
      '-y',
      `-i ${filePath}`,
      '-vframes 1',
      '-ss 00:00:00',
      `-vf scale=${THUMBNAIL_WIDTH}:${height}`,
      thumbnailPath,
    ];
    const ffmpeg = spawn(config.FFMPEG_PATH, args, { shell: true });

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
