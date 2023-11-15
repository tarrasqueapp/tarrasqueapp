import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../campaigns/guards/role.guard';
import { MediaService, ORIGINAL_FILENAME, THUMBNAIL_FILENAME } from '../media/media.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ConnectMapDto } from './dto/connect-map.dto';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { MapEntity } from './entities/map.entity';
import { MapsService } from './maps.service';

@ApiTags('maps')
@Controller('maps')
export class MapsController {
  constructor(
    private mapsService: MapsService,
    private mediaService: MediaService,
    private storageService: StorageService,
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
  @UseGuards(JwtAuthGuard, RoleGuard(Role.GAME_MASTER))
  @Post()
  @ApiCookieAuth()
  @ApiOkResponse({ type: MapEntity })
  createMap(@Body() data: CreateMapDto, @User() user: UserEntity): Promise<MapEntity> {
    return this.mapsService.createMap(data, user.id);
  }

  /**
   * Duplicate a map
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.GAME_MASTER))
  @Post(':mapId/duplicate')
  @ApiCookieAuth()
  @ApiOkResponse({ type: MapEntity })
  duplicateMap(@Param() { mapId }: ConnectMapDto): Promise<MapEntity> {
    return this.mapsService.duplicateMap(mapId);
  }

  /**
   * Update a map
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.GAME_MASTER))
  @Put(':mapId')
  @ApiCookieAuth()
  @ApiOkResponse({ type: MapEntity })
  async updateMap(@Param() { mapId }: ConnectMapDto, @Body() data: UpdateMapDto): Promise<MapEntity> {
    // Get the current map
    const map = await this.mapsService.getMap(mapId);

    // Check if media is being updated
    if (data.mediaIds) {
      // Find media that have been removed from the map
      const removedMedia = map.media.filter((media) => !data.mediaIds.includes(media.id));

      // Loop through all media items and delete them if they are not used by any other map
      for (const media of removedMedia) {
        // Get all maps that use the media item
        const maps = await this.mapsService.getMapsWithMediaId(media.id);

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
  @UseGuards(JwtAuthGuard, RoleGuard(Role.GAME_MASTER))
  @Delete(':mapId')
  @ApiCookieAuth()
  @ApiOkResponse({ type: MapEntity })
  async deleteMap(@Param() { mapId }: ConnectMapDto): Promise<MapEntity> {
    // Delete the map from the database
    const map = await this.mapsService.deleteMap(mapId);

    // Loop through all media items and delete them if they are not used by any other map
    for (const media of map.media) {
      // Get all maps that use the media item
      const maps = await this.mapsService.getMapsWithMediaId(media.id);

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
