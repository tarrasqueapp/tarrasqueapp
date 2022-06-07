import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { MapBaseEntity } from '../maps/entities/map-base.entity';
import { MapEntity } from '../maps/entities/map.entity';
import { MapsService } from '../maps/maps.service';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { RoleGuard } from '../users/guards/role.guard';
import { CampaignsService } from './campaigns.service';
import { ConnectCampaignDto } from './dto/connect-campaign.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignBaseEntity } from './entities/campaign-base.entity';
import { CampaignEntity } from './entities/campaign.entity';
import { CampaignRole, CampaignRoleGuard } from './guards/campaign-role.guard';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService, private readonly mapsService: MapsService) {}

  /**
   * Get all campaigns the user belongs to
   */
  @Get()
  @UseGuards(RoleGuard(Role.USER))
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
  @Post()
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ type: CampaignBaseEntity })
  createCampaign(@Body() data: CreateCampaignDto, @User() user: UserEntity): Promise<CampaignBaseEntity> {
    return this.campaignsService.createCampaign(data, user.id);
  }

  /**
   * Update a campaign
   */
  @Put(':campaignId')
  @UseGuards(CampaignRoleGuard(CampaignRole.OWNER))
  @UseGuards(RoleGuard(Role.USER))
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
  @Delete(':campaignId')
  @UseGuards(CampaignRoleGuard(CampaignRole.OWNER))
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ type: CampaignBaseEntity })
  deleteCampaign(@Param() { campaignId }: ConnectCampaignDto): Promise<CampaignBaseEntity> {
    return this.campaignsService.deleteCampaign(campaignId);
  }
}
