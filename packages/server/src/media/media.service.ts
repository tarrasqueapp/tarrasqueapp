import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { stat } from 'fs/promises';
import { PrismaService } from 'nestjs-prisma';

import { FileDto } from './dto/file.dto';
import { MediaEntity } from './entities/media.entity';

@Injectable()
export class MediaService {
  private logger: Logger = new Logger(MediaService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new media
   * @param data The media data
   * @param createdById The user id
   * @returns The created media
   */
  async createMedia(data: FileDto, createdById: string): Promise<string> {
    this.logger.verbose(`📂 Creating media from file "${data.name}`);
    // Get file from path
    const path = `/tmp/${data.name}`;
    if (!(await stat(path))) {
      throw new NotFoundException(`File "${data.name}" not found`);
    }
    return path;

    // try {
    //   // Create the media
    //   const media = await this.prisma.media.create({
    //     data: {
    //       name: data.name,
    //       createdBy: { connect: { id: createdById } },
    //     },
    //   });
    //   this.logger.debug(`✅️ Created media "${media.id}"`);
    //   return media;
    // } catch (error) {
    //   this.logger.error(error.message);
    //   throw new InternalServerErrorException(error.message);
    // }
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
}
