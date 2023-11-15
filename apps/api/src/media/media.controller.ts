import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createId } from '@paralleldrive/cuid2';
import fs from 'fs-extra';

import { config } from '@tarrasque/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StorageProviderEnum } from '../storage/storage-provider.enum';
import { StorageService } from '../storage/storage.service';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { FileDto } from './dto/file.dto';
import { MediaEntity } from './entities/media.entity';
import { MediaService, ORIGINAL_FILENAME, THUMBNAIL_FILENAME } from './media.service';

@UseGuards(JwtAuthGuard)
@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private mediaService: MediaService,
    private storageService: StorageService,
  ) {}

  /**
   * Create a new media item
   */
  @Post()
  @ApiCookieAuth()
  @ApiOkResponse({ type: MediaEntity })
  async createMedia(@Body() data: FileDto, @User() user: UserEntity): Promise<MediaEntity> {
    // Pre-generate id to use for the file name
    const id = createId();

    // Get the file from the tusd upload location
    const file = await this.storageService.getFile(`${this.storageService.tmpPath}/${data.id}`);

    // Write the file to the temp path if using S3 so we can generate a thumbnail
    if (config.STORAGE_PROVIDER === StorageProviderEnum.S3) {
      await fs.writeFile(`${this.storageService.tmpPathLocal}/${data.id}`, file);
    }

    // Generate thumbnail
    await this.mediaService.generateThumbnail(
      `${this.storageService.tmpPathLocal}/${data.id}`,
      `${this.storageService.tmpPathLocal}/${data.id}.${THUMBNAIL_FILENAME}`,
    );

    // Get the thumbnail from the temp path
    const thumbnail = await this.storageService.getFileLocal(
      `${this.storageService.tmpPathLocal}/${data.id}.${THUMBNAIL_FILENAME}`,
    );

    // Move the file from the temp path to the upload path
    const url = await this.storageService.moveFile(
      `${this.storageService.tmpPath}/${data.id}`,
      `${this.storageService.uploadPath}/${user.id}/${id}/${ORIGINAL_FILENAME}.${data.extension}`,
      data.type,
    );

    // Upload the thumbnail to the storage
    const thumbnailUrl = await this.storageService.upload(
      `${this.storageService.uploadPath}/${user.id}/${id}/${THUMBNAIL_FILENAME}`,
      thumbnail,
      'image/webp',
    );

    // Create the media
    const media = await this.mediaService.createMedia({
      id,
      name: data.name,
      url,
      thumbnailUrl,
      width: data.width,
      height: data.height,
      size: data.size,
      format: data.type,
      extension: data.extension,
      createdById: user.id,
    });

    // Delete the temporary files
    this.storageService.delete(`${this.storageService.tmpPath}/${data.id}.info`);
    this.storageService.deleteLocal(`${this.storageService.tmpPathLocal}/${data.id}`);
    this.storageService.deleteLocal(`${this.storageService.tmpPathLocal}/${data.id}.${THUMBNAIL_FILENAME}`);

    return media;
  }
}
