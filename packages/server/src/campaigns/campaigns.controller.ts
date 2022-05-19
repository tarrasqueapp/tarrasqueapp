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
  @ApiOkResponse({ status: 200, type: [CampaignEntity] })
  async getCampaigns(@User() user: UserEntity): Promise<CampaignEntity[]> {
    return await this.campaignsService.getUserCampaigns(user.id);
  }

  /**
   * Get a campaign by its id
   */
  @Get(':campaignId')
  @ApiOkResponse({ status: 200, type: CampaignEntity })
  async getCampaign(@Param() { campaignId }: ConnectCampaignDto): Promise<CampaignEntity> {
    return await this.campaignsService.getCampaign(campaignId);
  }

  /**
   * Get all maps for a campaign
   */
  @Get(':campaignId/maps')
  @ApiOkResponse({ status: 200, type: [MapEntity] })
  async getMaps(@Param() { campaignId }: ConnectCampaignDto): Promise<MapBaseEntity[]> {
    return await this.mapsService.getCampaignMaps(campaignId);
  }

  /**
   * Create a new campaign
   */
  @Post()
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: CampaignBaseEntity })
  async createCampaign(@Body() data: CreateCampaignDto, @User() user: UserEntity): Promise<CampaignBaseEntity> {
    return await this.campaignsService.createCampaign(data, user.id);
  }

  /**
   * Update a campaign
   */
  @Put(':campaignId')
  @UseGuards(CampaignRoleGuard(CampaignRole.OWNER))
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: CampaignBaseEntity })
  async updateCampaign(
    @Param() { campaignId }: ConnectCampaignDto,
    @Body() data: UpdateCampaignDto,
  ): Promise<CampaignBaseEntity> {
    return await this.campaignsService.updateCampaign(campaignId, data);
  }

  /**
   * Delete a campaign
   */
  @Delete(':campaignId')
  @UseGuards(CampaignRoleGuard(CampaignRole.OWNER))
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: CampaignBaseEntity })
  async deleteCampaign(@Param() { campaignId }: ConnectCampaignDto): Promise<CampaignBaseEntity> {
    return await this.campaignsService.deleteCampaign(campaignId);
  }
}
