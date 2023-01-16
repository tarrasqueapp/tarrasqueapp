import { BadRequestException, Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CampaignMemberRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailService } from '../email/email.service';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CampaignInvitesService } from './campaign-invites.service';
import { CampaignMembersService } from './campaign-members.service';
import { CampaignsService } from './campaigns.service';
import { ConnectCampaignInviteDto } from './dto/connect-campaign-invite.dto';
import { ConnectCampaignDto } from './dto/connect-campaign.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { CampaignBaseEntity } from './entities/campaign-base.entity';
import { CampaignRoleGuard } from './guards/campaign-role.guard';

@ApiTags('campaigns/:campaignId/invites')
@Controller('campaigns/:campaignId/invites')
export class CampaignInvitesController {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly campaignMembersService: CampaignMembersService,
    private readonly campaignInvitesService: CampaignInvitesService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Invite a user to a campaign
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignMemberRole.GAME_MASTER))
  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: CampaignBaseEntity })
  async createInvite(
    @Param() { campaignId }: ConnectCampaignDto,
    @Body() { email }: CreateInviteDto,
    @User() user: UserEntity,
  ): Promise<CampaignBaseEntity> {
    // Check if the user is already a member of the campaign
    const campaign = await this.campaignsService.getCampaign(campaignId);
    const isMember = campaign.members.some((member) => member.user.id === user.id || member.user.email === email);

    if (isMember) {
      throw new BadRequestException('User is already a member of the campaign');
    }

    // Check if the user is already invited to the campaign
    const isInvited = campaign.invites.some((invite) => invite.email === email);

    if (isInvited) {
      throw new BadRequestException('User is already invited to the campaign');
    }

    // Check if the user is the current user
    if (user.email === email) {
      throw new BadRequestException('You cannot invite yourself to a campaign');
    }

    try {
      // Check if the invited user already has an account
      const invitee = await this.usersService.getUserByEmail(email);
      // Create a token for the invited user
      const token = await this.campaignInvitesService.createInvite({ email, userId: invitee.id, campaignId });
      // Send an email to the invited user
      await this.emailService.sendCampaignInviteExistingUserEmail({
        hostName: user.displayName,
        campaignName: campaign.name,
        inviteeName: invitee.displayName,
        to: invitee.email,
        token: token.value,
      });
    } catch (e) {
      // Create a token for the invited user
      const token = await this.campaignInvitesService.createInvite({ email, campaignId });
      // Send an email to the invited user
      await this.emailService.sendCampaignInviteNewUserEmail({
        hostName: user.displayName,
        campaignName: campaign.name,
        to: email,
        token: token.value,
      });
    }

    return this.campaignsService.getCampaign(campaignId);
  }

  /**
   * Remove an invited user from a campaign
   */
  @UseGuards(JwtAuthGuard, CampaignRoleGuard(CampaignMemberRole.GAME_MASTER))
  @Delete(':inviteId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CampaignBaseEntity })
  async removeInvite(@Param() { campaignId, inviteId }: ConnectCampaignInviteDto): Promise<CampaignBaseEntity> {
    // Delete the invite
    await this.campaignInvitesService.deleteInvite(inviteId);

    return this.campaignsService.getCampaign(campaignId);
  }

  /**
   * Accept an invite to a campaign
   */
  @UseGuards(JwtAuthGuard)
  @Post(':inviteId/accept')
  @ApiBearerAuth()
  @ApiOkResponse({ type: null })
  async acceptInvite(
    @Param() { campaignId, inviteId }: ConnectCampaignInviteDto,
    @User() user: UserEntity,
  ): Promise<void> {
    // Delete the invite
    await this.campaignInvitesService.deleteInvite(inviteId);
    // Add the user to the campaign
    await this.campaignMembersService.createMember({ userId: user.id, campaignId });
  }

  /**
   * Decline an invite to a campaign
   */
  @UseGuards(JwtAuthGuard)
  @Post(':inviteId/decline')
  @ApiBearerAuth()
  @ApiOkResponse({ type: null })
  async declineInvite(@Param() { inviteId }: ConnectCampaignInviteDto): Promise<void> {
    // Delete the invite
    await this.campaignInvitesService.deleteInvite(inviteId);
  }
}
