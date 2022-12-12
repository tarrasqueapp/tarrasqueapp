import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CampaignRole, CampaignRoleGuard } from '../campaigns/guards/campaign-role.guard';
import { MediaService, ORIGINAL_FILENAME, THUMBNAIL_FILENAME } from '../media/media.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { RoleGuard } from '../users/guards/role.guard';
import { ConnectMapDto } from './dto/connect-map.dto';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { MapBaseEntity } from './entities/map-base.entity';
import { MapEntity } from './entities/map.entity';
import { MapsService } from './maps.service';

@ApiTags('maps')
@Controller('maps')
export class MapsController {
  constructor(
    private readonly mapsService: MapsService,
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Get a map by its id
   */
  @Get(':mapId')
  @ApiOkResponse({ type: MapEntity })
  getMap(@Param() { mapId }: ConnectMapDto): Promise<MapEntity> {
    return this.mapsService.getMap(mapId);
  }

  /**
   * Create a new map
   */
  @UseGuards(RoleGuard(Role.USER), CampaignRoleGuard(CampaignRole.OWNER))
  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  createMap(@Body() data: CreateMapDto, @User() user: UserEntity): Promise<MapBaseEntity> {
    return this.mapsService.createMap(data, user.id);
  }

  /**
   * Duplicate a map
   */
  @UseGuards(RoleGuard(Role.USER), CampaignRoleGuard(CampaignRole.OWNER))
  @Post(':mapId/duplicate')
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  duplicateMap(@Param() { mapId }: ConnectMapDto): Promise<MapBaseEntity> {
    return this.mapsService.duplicateMap(mapId);
  }

  /**
   * Update a map
   */
  @UseGuards(RoleGuard(Role.USER), CampaignRoleGuard(CampaignRole.OWNER))
  @Put(':mapId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  async updateMap(@Param() { mapId }: ConnectMapDto, @Body() data: UpdateMapDto): Promise<MapBaseEntity> {
    // Check if media is being updated
    if (data.mediaId) {
      try {
        // Check that the new media exists
        await this.mediaService.getMedia(data.mediaId);
        // Delete the old media
        const media = await this.mediaService.deleteMedia(data.mediaId);
        // Delete the files from the storage
        await Promise.all([
          this.storageService.delete(`${media.createdById}/${media.id}/${ORIGINAL_FILENAME}.${media.extension}`),
          this.storageService.delete(`${media.createdById}/${media.id}/${THUMBNAIL_FILENAME}`),
        ]);
      } catch (e) {
        // If the new media doesn't exist, delete the mediaId from the data
        delete data.mediaId;
      }
    }
    // Update the map
    return this.mapsService.updateMap(mapId, data);
  }

  /**
   * Delete a map
   */
  @UseGuards(RoleGuard(Role.USER), CampaignRoleGuard(CampaignRole.OWNER))
  @Delete(':mapId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  async deleteMap(@Param() { mapId }: ConnectMapDto): Promise<MapBaseEntity> {
    // Delete the map and the media item from the database
    const map = await this.mapsService.deleteMap(mapId);
    const media = await this.mediaService.deleteMedia(map.mediaId);
    // Delete the files from the storage
    await Promise.all([
      this.storageService.delete(`${media.createdById}/${media.id}/${ORIGINAL_FILENAME}.${media.extension}`),
      this.storageService.delete(`${media.createdById}/${media.id}/${THUMBNAIL_FILENAME}`),
    ]);
    // Return the map
    return map;
  }
}
