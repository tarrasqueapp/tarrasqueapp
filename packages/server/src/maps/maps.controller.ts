import { Body, Controller, Delete, ForbiddenException, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { CampaignsService } from '../campaigns/campaigns.service';
import { ConnectCampaignDto } from '../campaigns/dto/connect-campaign.dto';
import { UserDecorator } from '../common/decorators/user.decorator';
import { ConnectMapDto } from './dto/connect-map.dto';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { MapBaseEntity } from './entities/map-base.entity';
import { MapEntity } from './entities/map.entity';
import { MapsService } from './maps.service';

@ApiTags('maps')
@Controller()
export class MapsController {
  private logger: Logger = new Logger(MapsController.name);

  constructor(private readonly mapsService: MapsService, private readonly campaignsService: CampaignsService) {}

  /**
   * Get all maps for a campaign
   */
  @Get()
  @ApiOkResponse({ status: 200, type: [MapEntity] })
  async getMaps(@Param() { campaignId }: ConnectCampaignDto): Promise<MapBaseEntity[]> {
    return await this.mapsService.getCampaignMaps(campaignId);
  }

  /**
   * Get a map by its id
   */
  @Get(':mapId')
  @ApiOkResponse({ status: 200, type: MapEntity })
  async getMap(@Param() { mapId }: ConnectMapDto): Promise<MapEntity> {
    return await this.mapsService.getMap(mapId);
  }

  /**
   * Create a new map for the current campaign
   */
  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: MapBaseEntity })
  async createMap(
    @Param() { campaignId }: ConnectCampaignDto,
    @Body() data: CreateMapDto,
    @UserDecorator() user: User,
  ): Promise<MapBaseEntity> {
    // Check if the user is allowed to create a map in this campaign
    const campaign = await this.campaignsService.getCampaign(campaignId);
    if (campaign.createdById !== user.id) {
      this.logger.error(`🚨 User "${user.id}" is not allowed to create a map in campaign "${campaignId}"`);
      throw new ForbiddenException("You don't have permission to create a map in this campaign");
    }
    // Create the map
    return await this.mapsService.createMap(data, user.id);
  }

  /**
   * Duplicate a map in the current campaign
   */
  @Post(':mapId/duplicate')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: MapBaseEntity })
  async duplicateMap(@Param() { mapId }: ConnectMapDto, @UserDecorator() user: User): Promise<MapBaseEntity> {
    // Check if the user is allowed to duplicate this map
    const map = await this.mapsService.getMap(mapId);
    if (map.createdById !== user.id) {
      this.logger.error(
        `🚨 User "${user.id}" is not allowed to duplicate map "${mapId}" in campaign "${map.campaignId}"`,
      );
      throw new ForbiddenException("You don't have permission to duplicate this map");
    }
    // Duplicate the map
    return await this.mapsService.duplicateMap(mapId);
  }

  /**
   * Update a map
   */
  @Put(':mapId')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: MapBaseEntity })
  async updateMap(
    @Param() { mapId }: ConnectMapDto,
    @Body() data: UpdateMapDto,
    @UserDecorator() user: User,
  ): Promise<MapBaseEntity> {
    // Check if the user is allowed to update this map
    const map = await this.mapsService.getMap(mapId);
    if (map.createdById !== user.id) {
      this.logger.error(`🚨 User "${user.id}" is not allowed to update map "${mapId}" in campaign "${map.campaignId}"`);
      throw new ForbiddenException("You don't have permission to update this map");
    }
    // Update the map
    return await this.mapsService.updateMap(mapId, data);
  }

  /**
   * Delete a map
   */
  @Delete(':mapId')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: MapBaseEntity })
  async deleteMap(@Param() { mapId }: ConnectMapDto, @UserDecorator() user: User): Promise<MapBaseEntity> {
    // Check if the user is allowed to delete this map
    const map = await this.mapsService.getMap(mapId);
    if (map.createdById !== user.id) {
      this.logger.error(`🚨 User "${user.id}" is not allowed to delete map "${mapId}" in campaign "${map.campaignId}"`);
      throw new ForbiddenException("You don't have permission to delete this map");
    }
    // Delete the map
    return await this.mapsService.deleteMap(mapId);
  }
}
