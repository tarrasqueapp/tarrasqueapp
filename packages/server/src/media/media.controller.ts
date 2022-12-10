import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import cuid from 'cuid';

import { StorageService } from '../storage/storage.service';
import { TmpService } from '../storage/tmp.service';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { RoleGuard } from '../users/guards/role.guard';
import { FileDto } from './dto/file.dto';
import { MediaEntity } from './entities/media.entity';
import { MediaService, ORIGINAL_FILENAME, THUMBNAIL_FILENAME } from './media.service';

@UseGuards(RoleGuard(Role.USER))
@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
    private readonly tmpService: TmpService,
  ) {}

  /**
   * Create a new media item
   */
  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: MediaEntity })
  async createMedia(@Body() data: FileDto, @User() user: UserEntity): Promise<MediaEntity> {
    // Pre-generate id to use for the file name
    const id = cuid();

    // Generate a thumbnail
    await this.mediaService.generateThumbnail(data.name);
    const thumbnailName = `${data.name}.${THUMBNAIL_FILENAME}`;

    // Get the file and thumbnail from the temp path
    const [file, thumbnail] = await Promise.all([
      this.tmpService.getFile(data.name),
      this.tmpService.getFile(thumbnailName),
    ]);

    // Upload the file and thumbnail to the storage
    const [url, thumbnailUrl] = await Promise.all([
      this.storageService.upload(`${user.id}/${id}/${ORIGINAL_FILENAME}.${data.extension}`, file, data.type),
      this.storageService.upload(`${user.id}/${id}/${THUMBNAIL_FILENAME}`, thumbnail, 'image/webp'),
    ]);

    // Create the media
    const media = await this.mediaService.createMedia(
      {
        id,
        url,
        thumbnailUrl,
        width: data.width,
        height: data.height,
        size: data.size,
        format: data.type,
        extension: data.extension,
      },
      user.id,
    );

    // Delete the temporary files
    this.tmpService.deleteFile(data.name);
    this.tmpService.deleteFile(thumbnailName);

    return media;
  }
}
