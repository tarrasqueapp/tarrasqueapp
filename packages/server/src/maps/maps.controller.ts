import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CampaignRole, CampaignRoleGuard } from '../campaigns/guards/campaign-role.guard';
import { MediaService, ORIGINAL_FILENAME, THUMBNAIL_FILENAME } from '../media/media.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
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
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignRole.OWNER))
  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  createMap(@Body() data: CreateMapDto, @User() user: UserEntity): Promise<MapBaseEntity> {
    return this.mapsService.createMap(data, user.id);
  }

  /**
   * Duplicate a map
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignRole.OWNER))
  @Post(':mapId/duplicate')
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  duplicateMap(@Param() { mapId }: ConnectMapDto): Promise<MapBaseEntity> {
    return this.mapsService.duplicateMap(mapId);
  }

  /**
   * Update a map
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignRole.OWNER))
  @Put(':mapId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  async updateMap(@Param() { mapId }: ConnectMapDto, @Body() data: UpdateMapDto): Promise<MapBaseEntity> {
    // Get the current map
    const map = await this.mapsService.getMap(mapId);

    // Check if media is being updated
    if (data.mediaIds) {
      // Find media that have been removed from the map
      const removedMedia = map.media.filter((media) => !data.mediaIds.includes(media.id));

      // Loop through all media items and delete them if they are not used by any other map
      for (const media of removedMedia) {
        // Get all maps that use the media item
        const maps = await this.mapsService.getMaps({ where: { media: { some: { id: media.id } } } });

        if (maps.length === 1) {
          // Delete the media item from the database and its files from the storage
          this.mediaService.deleteMedia(media.id);
          this.storageService.delete(
            `${this.storageService.uploadPath}/${media.createdById}/${media.id}/${ORIGINAL_FILENAME}.${media.extension}`,
          );
          this.storageService.delete(
            `${this.storageService.uploadPath}/${media.createdById}/${media.id}/${THUMBNAIL_FILENAME}`,
          );
        }
      }

      // Find media that have been added to the map
      const addedMedia = data.mediaIds.filter((mediaId) => !map.media.map((media) => media.id).includes(mediaId));

      // Loop through all media items and check if they exist
      for (const mediaId of addedMedia) {
        try {
          // Check that the new media exists
          await this.mediaService.getMedia(mediaId);
        } catch (e) {
          // If the new media doesn't exist, delete its id from the map
          data.mediaIds = data.mediaIds.filter((id) => id !== mediaId);
        }
      }
    }

    // Update the map
    return this.mapsService.updateMap(mapId, data);
  }

  /**
   * Delete a map
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignRole.OWNER))
  @Delete(':mapId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  async deleteMap(@Param() { mapId }: ConnectMapDto): Promise<MapBaseEntity> {
    // Delete the map from the database
    const map = await this.mapsService.deleteMap(mapId);

    // Loop through all media items and delete them if they are not used by any other map
    for (const media of map.media) {
      // Get all maps that use the media item
      const maps = await this.mapsService.getMaps({ where: { media: { some: { id: media.id } } } });

      if (maps.length === 0) {
        // Delete the media item from the database and its files from the storage
        await Promise.all([
          this.mediaService.deleteMedia(media.id),
          this.storageService.delete(
            `${this.storageService.uploadPath}/${media.createdById}/${media.id}/${ORIGINAL_FILENAME}.${media.extension}`,
          ),
          this.storageService.delete(
            `${this.storageService.uploadPath}/${media.createdById}/${media.id}/${THUMBNAIL_FILENAME}`,
          ),
        ]);
      }
    }

    // Return the map
    return map;
  }
}
