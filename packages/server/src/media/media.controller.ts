import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { RoleGuard } from '../users/guards/role.guard';
import { FileDto } from './dto/file.dto';
import { MediaEntity } from './entities/media.entity';
import { MediaService } from './media.service';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Create a new media item
   */
  @Post()
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ type: MediaEntity })
  async createMedia(@Body() data: FileDto, @User() user: UserEntity): Promise<string> {
    return await this.mediaService.createMedia(data, user.id);
  }
}
