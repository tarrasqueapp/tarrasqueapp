import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { spawn } from 'child_process';
import { stat } from 'fs-extra';
import { PrismaService } from 'nestjs-prisma';

import { CreateMediaDto } from './dto/create-media.dto';
import { MediaEntity } from './entities/media.entity';

@Injectable()
export class MediaService {
  private logger: Logger = new Logger(MediaService.name);
  THUMBNAIL_SUFFIX = '.thumbnail.webp';

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new media
   * @param data The media data
   * @param createdById The user id
   * @returns The created media
   */
  async createMedia(data: CreateMediaDto, createdById: string): Promise<MediaEntity> {
    this.logger.verbose(`📂 Creating media`);
    try {
      // Create the media
      const media = await this.prisma.media.create({
        data: {
          url: data.url,
          thumbnailUrl: data.thumbnailUrl,
          width: data.width,
          height: data.height,
          size: data.size,
          format: data.format,
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
   * @param mediaId The media id
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
   * @param fileName The temporary file name
   * @returns Thumbnail path
   */
  async generateThumbnail(fileName: string): Promise<string> {
    this.logger.verbose(`📂 Generating thumbnail for file "${fileName}"`);

    const filePath = `/tmp/${fileName}`;
    if (!(await stat(filePath))) {
      throw new NotFoundException(`File "${filePath}" not found`);
    }

    const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
    const width = 400;
    const height = -1;

    const thumbnailPath = `${filePath}${this.THUMBNAIL_SUFFIX}`;

    const args = [
      '-y',
      `-i ${filePath}`,
      '-vframes 1',
      '-ss 00:00:00',
      `-vf scale=${width}:${height}`,
      '-c:v webp',
      thumbnailPath,
    ];
    const ffmpeg = spawn(ffmpegPath, args, { shell: true });

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
          const error = new Error(`ffmpeg exited ${code}\nffmpeg stderr:\n\n${stderr}`);
          reject(error);
        }
        if (stderr.includes('nothing was encoded')) {
          const error = new Error(`ffmpeg failed to encode file\nffmpeg stderr:\n\n${stderr}`);
          reject(error);
        }
      });

      ffmpeg.on('close', resolve);
    });
  }
}
