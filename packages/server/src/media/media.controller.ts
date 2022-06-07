import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { StorageService } from '../storage/storage.service';
import { TmpService } from '../storage/tmp.service';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { RoleGuard } from '../users/guards/role.guard';
import { FileDto } from './dto/file.dto';
import { MediaEntity } from './entities/media.entity';
import { MediaService } from './media.service';

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
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ type: MediaEntity })
  async createMedia(@Body() data: FileDto, @User() user: UserEntity): Promise<MediaEntity> {
    // Generate a thumbnail
    await this.mediaService.generateThumbnail(data.name);
    const thumbnailName = `${data.name}${this.mediaService.THUMBNAIL_SUFFIX}`;

    // Get the file and thumbnail from the temp path
    const file = await this.tmpService.getFile(data.name);
    const thumbnail = await this.tmpService.getFile(`${thumbnailName}`);

    // Upload the file and thumbnail to the storage
    const url = await this.storageService.upload(`${user.id}/${data.name}.${data.extension}`, file);
    const thumbnailUrl = await this.storageService.upload(`${user.id}/${thumbnailName}`, thumbnail);

    // Create the media
    const media = await this.mediaService.createMedia(
      { url, thumbnailUrl, width: data.width, height: data.height, size: data.size, format: data.type },
      user.id,
    );

    // Delete the temporary files
    this.tmpService.deleteFile(data.name);
    this.tmpService.deleteFile(`${thumbnailName}`);

    return media;
  }
}
