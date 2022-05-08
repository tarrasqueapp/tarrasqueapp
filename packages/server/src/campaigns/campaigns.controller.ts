import { Body, Controller, Delete, ForbiddenException, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { UserDecorator } from '../common/decorators/user.decorator';
import { CampaignsService } from './campaigns.service';
import { ConnectCampaignDto } from './dto/connect-campaign.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignBaseEntity } from './entities/campaign-base.entity';
import { CampaignEntity } from './entities/campaign.entity';

@ApiTags('campaigns')
@Controller()
export class CampaignsController {
  private logger: Logger = new Logger(CampaignsController.name);

  constructor(private readonly campaignsService: CampaignsService) {}

  /**
   * Get all campaigns the user belongs to
   */
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: [CampaignEntity] })
  async getCampaigns(@UserDecorator() user: User): Promise<CampaignEntity[]> {
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
   * Create a new campaign
   */
  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: CampaignBaseEntity })
  async createCampaign(@Body() data: CreateCampaignDto, @UserDecorator() user: User): Promise<CampaignBaseEntity> {
    return await this.campaignsService.createCampaign(data, user.id);
  }

  /**
   * Update a campaign
   */
  @Put(':campaignId')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: CampaignBaseEntity })
  async updateCampaign(
    @Param() { campaignId }: ConnectCampaignDto,
    @Body() data: UpdateCampaignDto,
    @UserDecorator() user: User,
  ): Promise<CampaignBaseEntity> {
    // User must be the creator of the campaign
    const campaign = await this.campaignsService.getCampaign(campaignId);
    if (campaign.createdById !== user.id) {
      this.logger.error(`🚨 User "${user.id}" is not allowed to update campaign "${campaignId}"`);
      throw new ForbiddenException("You don't have permission to update this campaign");
    }
    // Update the campaign
    return await this.campaignsService.updateCampaign(campaignId, data);
  }

  /**
   * Delete a campaign
   */
  @Delete(':campaignId')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: CampaignBaseEntity })
  async deleteCampaign(
    @Param() { campaignId }: ConnectCampaignDto,
    @UserDecorator() user: User,
  ): Promise<CampaignBaseEntity> {
    // User must be the creator of the campaign
    const campaign = await this.campaignsService.getCampaign(campaignId);
    if (campaign.createdById !== user.id) {
      this.logger.error(`🚨 User "${user.id}" is not the creator of campaign "${campaignId}"`);
      throw new ForbiddenException("You don't have permission to delete this campaign");
    }
    // Delete the campaign
    return await this.campaignsService.deleteCampaign(campaignId);
  }
}
