import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MapBaseEntity } from '../maps/entities/map-base.entity';
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
import { CampaignBaseEntity } from './entities/campaign-base.entity';
import { CampaignEntity } from './entities/campaign.entity';
import { CampaignRole, CampaignRoleGuard } from './guards/campaign-role.guard';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly mapsService: MapsService,
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Get all campaigns the user belongs to
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: [CampaignEntity] })
  getCampaigns(@User() user: UserEntity): Promise<CampaignEntity[]> {
    return this.campaignsService.getUserCampaigns(user.id);
  }

  /**
   * Get a campaign by its id
   */
  @Get(':campaignId')
  @ApiOkResponse({ type: CampaignEntity })
  getCampaign(@Param() { campaignId }: ConnectCampaignDto): Promise<CampaignEntity> {
    return this.campaignsService.getCampaign(campaignId);
  }

  /**
   * Get all maps for a campaign
   */
  @Get(':campaignId/maps')
  @ApiOkResponse({ type: [MapEntity] })
  getMaps(@Param() { campaignId }: ConnectCampaignDto): Promise<MapBaseEntity[]> {
    return this.mapsService.getCampaignMaps(campaignId);
  }

  /**
   * Create a new campaign
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: CampaignBaseEntity })
  createCampaign(@Body() data: CreateCampaignDto, @User() user: UserEntity): Promise<CampaignBaseEntity> {
    return this.campaignsService.createCampaign(data, user.id);
  }

  /**
   * Update a campaign
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignRole.OWNER))
  @Put(':campaignId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CampaignBaseEntity })
  updateCampaign(
    @Param() { campaignId }: ConnectCampaignDto,
    @Body() data: UpdateCampaignDto,
  ): Promise<CampaignBaseEntity> {
    return this.campaignsService.updateCampaign(campaignId, data);
  }

  /**
   * Delete a campaign
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignRole.OWNER))
  @Delete(':campaignId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CampaignBaseEntity })
  async deleteCampaign(@Param() { campaignId }: ConnectCampaignDto): Promise<CampaignBaseEntity> {
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

        // Return the deleted map
        return deletedMap;
      }),
    );

    // Delete the campaign
    return await this.campaignsService.deleteCampaign(campaignId);
  }

  /**
   * Reorder campaigns
   */
  @UseGuards(JwtAuthGuard)
  @Post('reorder')
  @ApiBearerAuth()
  @ApiOkResponse({ type: [CampaignEntity] })
  reorderCampaigns(@Body() { campaignIds }: ReorderCampaignsDto, @User() user: UserEntity): Promise<CampaignEntity[]> {
    return this.campaignsService.reorderCampaigns(campaignIds, user.id);
  }

  /**
   * Reorder maps
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignRole.OWNER))
  @Post(':campaignId/maps/reorder')
  @ApiBearerAuth()
  @ApiOkResponse({ type: [MapBaseEntity] })
  reorderMaps(
    @Param() { campaignId }: ConnectCampaignDto,
    @Body() { mapIds }: ReorderMapsDto,
  ): Promise<MapBaseEntity[]> {
    return this.mapsService.reorderMaps(campaignId, mapIds);
  }
}
