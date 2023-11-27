import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MapEntity } from '../maps/entities/map.entity';
import { MapsService } from '../maps/maps.service';
import { MediaService, ORIGINAL_FILENAME, THUMBNAIL_FILENAME } from '../media/media.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CampaignsService } from './campaigns.service';
import { ConnectCampaignDto } from './dto/connect-campaign.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ReorderCampaignsDto } from './dto/reorder-campaigns.dto';
import { ReorderMapsDto } from './dto/reorder-maps.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignEntity } from './entities/campaign.entity';
import { RoleGuard } from './guards/role.guard';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(
    private campaignsService: CampaignsService,
    private mapsService: MapsService,
    private mediaService: MediaService,
    private storageService: StorageService,
  ) {}

  /**
   * Get all campaigns the user belongs to
   * @param user - The user
   * @returns All campaigns the user belongs to
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiCookieAuth()
  @ApiOkResponse({ type: [CampaignEntity] })
  getCampaignsByUserId(@User() user: UserEntity): Promise<CampaignEntity[]> {
    // Get the campaigns
    return this.campaignsService.getCampaignsByUserId(user.id);
  }

  /**
   * Get a campaign by its id
   * @param campaignId - The campaign id
   * @returns The campaign
   */
  @Get(':campaignId')
  @ApiOkResponse({ type: CampaignEntity })
  getCampaignById(@Param() { campaignId }: ConnectCampaignDto): Promise<CampaignEntity> {
    // Get the campaign
    return this.campaignsService.getCampaignById(campaignId);
  }

  /**
   * Get all maps for a campaign
   * @param campaignId - The campaign id
   * @returns All maps for a campaign
   */
  @Get(':campaignId/maps')
  @ApiOkResponse({ type: [MapEntity] })
  getMaps(@Param() { campaignId }: ConnectCampaignDto): Promise<MapEntity[]> {
    // Get the maps
    return this.mapsService.getCampaignMaps(campaignId);
  }

  /**
   * Create a new campaign
   * @param data - The campaign data
   * @param user - The user
   * @returns The created campaign
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCookieAuth()
  @ApiOkResponse({ type: CampaignEntity })
  async createCampaign(@Body() data: CreateCampaignDto, @User() user: UserEntity): Promise<CampaignEntity> {
    // Create the campaign
    const campaign = await this.campaignsService.createCampaign({ ...data, createdById: user.id });

    // Return the created campaign
    return campaign;
  }

  /**
   * Update a campaign
   * @param campaignId - The campaign id
   * @param data - The campaign data
   * @returns The updated campaign
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.GAME_MASTER))
  @Put(':campaignId')
  @ApiCookieAuth()
  @ApiOkResponse({ type: CampaignEntity })
  async updateCampaign(
    @Param() { campaignId }: ConnectCampaignDto,
    @Body() data: UpdateCampaignDto,
  ): Promise<CampaignEntity> {
    // Update the campaign
    const campaign = await this.campaignsService.updateCampaign(campaignId, data);

    // Return the updated campaign
    return campaign;
  }

  /**
   * Delete a campaign
   * @param campaignId - The campaign id
   * @returns The deleted campaign
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.GAME_MASTER))
  @Delete(':campaignId')
  @ApiCookieAuth()
  @ApiOkResponse({ type: CampaignEntity })
  async deleteCampaign(@Param() { campaignId }: ConnectCampaignDto): Promise<CampaignEntity> {
    // Get every map for the campaign
    const maps = await this.mapsService.getCampaignMaps(campaignId);

    // Delete all campaign maps and their media items
    await Promise.all(
      maps.map(async (map) => {
        // Delete the map from the database
        const deletedMap = await this.mapsService.deleteMap(map.id);

        // Loop through all media items and delete them if they are not used by any other map
        for (const media of deletedMap.media) {
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

        // Return the deleted map
        return deletedMap;
      }),
    );

    // Delete the campaign
    const campaign = await this.campaignsService.deleteCampaign(campaignId);

    // Return the deleted campaign
    return campaign;
  }

  /**
   * Reorder campaigns
   * @param campaignIds - The campaign ids
   * @param user - The user
   * @returns The reordered campaigns
   */
  @UseGuards(JwtAuthGuard)
  @Post('reorder')
  @ApiCookieAuth()
  @ApiOkResponse({ type: [CampaignEntity] })
  async reorderCampaigns(
    @Body() { campaignIds }: ReorderCampaignsDto,
    @User() user: UserEntity,
  ): Promise<CampaignEntity[]> {
    // Reorder the campaigns
    const campaigns = await this.campaignsService.reorderCampaigns(campaignIds, user);

    // Return the reordered campaigns
    return campaigns;
  }

  /**
   * Reorder maps
   * @param campaignId - The campaign id
   * @param mapIds - The map ids
   * @returns The reordered maps
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.GAME_MASTER))
  @Post(':campaignId/maps/reorder')
  @ApiCookieAuth()
  @ApiOkResponse({ type: [MapEntity] })
  reorderMaps(@Param() { campaignId }: ConnectCampaignDto, @Body() { mapIds }: ReorderMapsDto): Promise<MapEntity[]> {
    // Reorder the maps
    this.campaignsService.reorderMaps(campaignId, mapIds);

    // Return the reordered maps
    return this.mapsService.getCampaignMaps(campaignId);
  }
}
