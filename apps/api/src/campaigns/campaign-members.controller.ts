import { Body, Controller, Delete, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CampaignMemberRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CampaignMembersService } from './campaign-members.service';
import { CampaignsService } from './campaigns.service';
import { ConnectCampaignMemberDto } from './dto/connect-campaign-member.dto';
import { UpdateCampaignMemberDto } from './dto/update-campaign-member.dto';
import { CampaignEntity } from './entities/campaign.entity';
import { CampaignRoleGuard } from './guards/campaign-role.guard';

@ApiTags('campaigns/:campaignId/members')
@Controller('campaigns/:campaignId/members')
export class CampaignMembersController {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly campaignMembersService: CampaignMembersService,
  ) {}

  /**
   * Update a member of a campaign
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignMemberRole.GAME_MASTER))
  @Put(':memberId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CampaignEntity })
  async updateMember(
    @Param() { campaignId, memberId }: ConnectCampaignMemberDto,
    @Body() member: UpdateCampaignMemberDto,
  ): Promise<CampaignEntity> {
    // Update the member
    await this.campaignMembersService.updateMember(memberId, member);
    // Return the campaign
    return this.campaignsService.getCampaign(campaignId);
  }

  /**
   * Delete a member from a campaign
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignMemberRole.GAME_MASTER))
  @Delete(':memberId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CampaignEntity })
  async deleteMember(@Param() { campaignId, memberId }: ConnectCampaignMemberDto): Promise<CampaignEntity> {
    // Delete the member
    await this.campaignMembersService.deleteMember(memberId);
    // Return the campaign
    return this.campaignsService.getCampaign(campaignId);
  }
}
