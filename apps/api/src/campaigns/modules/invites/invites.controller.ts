import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';

import { ActionTokenEntity } from '../../../action-tokens/entities/action-token.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { EmailService } from '../../../email/email.service';
import { User } from '../../../users/decorators/user.decorator';
import { UserEntity } from '../../../users/entities/user.entity';
import { UsersService } from '../../../users/users.service';
import { CampaignsService } from '../../campaigns.service';
import { ConnectCampaignDto } from '../../dto/connect-campaign.dto';
import { RoleGuard } from '../../guards/role.guard';
import { MembershipsService } from '../memberships/memberships.service';
import { ConnectCampaignInviteDto } from './dto/connect-campaign-invite.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { InvitesService } from './invites.service';

@UseGuards(JwtAuthGuard)
@Controller('campaigns/:campaignId/invites')
export class InvitesController {
  constructor(
    private invitesService: InvitesService,
    private campaignsService: CampaignsService,
    private membershipsService: MembershipsService,
    private emailService: EmailService,
    private usersService: UsersService,
  ) {}

  /**
   * Get a campaign's invites
   * @param params - The campaign's id
   * @returns The campaign's invites
   */
  @UseGuards(RoleGuard(Role.PLAYER))
  @Get()
  async getCampaignInvites(@Param() params: ConnectCampaignDto): Promise<ActionTokenEntity[] | undefined> {
    // Get the campaign with its invites
    return await this.invitesService.getInvitesByCampaignId(params.campaignId);
  }

  /**
   * Invite a user to a campaign
   * @param params - The campaign's id
   * @param data - The user's data
   */
  @UseGuards(RoleGuard(Role.GAME_MASTER))
  @Post()
  async createInvite(
    @Param() params: ConnectCampaignDto,
    @Body() data: CreateInviteDto,
    @User() user: UserEntity,
  ): Promise<ActionTokenEntity> {
    // Check that the campaign exists
    const campaign = await this.campaignsService.getCampaignById(params.campaignId);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Get the campaign's memberships
    const memberships = await this.membershipsService.getCampaignMemberships(params.campaignId);

    // Normalize the email
    const email = data.email.toLowerCase();

    // Check that the user is not already in the campaign
    memberships.forEach((membership) => {
      if (membership.user.email === email) {
        throw new ConflictException('User already in campaign');
      }
    });

    // Get the campaign's invites
    const invites = await this.invitesService.getInvitesByCampaignId(params.campaignId);

    // Check that the user is not already invited to the campaign
    invites.forEach((invite) => {
      if (invite.email === email) {
        throw new ConflictException('User already invited to campaign');
      }
    });

    // Check if the user already exists in the database
    const existingUser = await this.usersService.getUserByEmail(email);

    // Generate the invite token
    const invite = await this.invitesService.createInvite({ email, userId: existingUser?.id, campaign });

    // Send the email
    if (existingUser) {
      await this.emailService.sendCampaignInviteExistingUserEmail({
        inviteeName: existingUser.displayName,
        hostName: user.displayName,
        campaignName: campaign.name,
        to: existingUser.email,
        token: invite.id,
      });
    } else {
      await this.emailService.sendCampaignInviteNewUserEmail({
        hostName: user.displayName,
        campaignName: campaign.name,
        to: email,
        token: invite.id,
      });
    }

    // Return the invite
    return invite;
  }

  /**
   * Delete a campaign invite
   * @param params - The campaign's id and invite's id
   * @returns The deleted invite
   */
  @UseGuards(RoleGuard(Role.GAME_MASTER))
  @Delete(':inviteId')
  async deleteInvite(@Param() params: ConnectCampaignInviteDto): Promise<ActionTokenEntity> {
    // Check that the campaign exists
    const campaign = await this.campaignsService.getCampaignById(params.campaignId);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Check that invite exists
    const invite = await this.invitesService.getInviteById(params.inviteId);
    if (!invite) {
      throw new NotFoundException('Invalid or expired token');
    }

    // Check that invite belongs to the campaign
    if (invite.campaignId !== params.campaignId) {
      throw new BadRequestException('Invite is not for this campaign');
    }

    // Delete the invite
    const deletedInvite = await this.invitesService.deleteInvite(invite);

    // Return the deleted invite
    return deletedInvite;
  }

  /**
   * Accept a campaign invite
   * @param params - The campaign's id and invite's id
   * @param user - The user
   * @returns The accepted invite
   */
  @Post(':inviteId/accept')
  async acceptInvite(@Param() params: ConnectCampaignInviteDto, @User() user: UserEntity): Promise<ActionTokenEntity> {
    // Check that the campaign exists
    const campaign = await this.campaignsService.getCampaignById(params.campaignId);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Check that invite exists
    const invite = await this.invitesService.getInviteById(params.inviteId);
    if (!invite) {
      throw new NotFoundException('Invalid or expired token');
    }

    // Check that invite belongs to the campaign
    if (invite.campaignId !== params.campaignId) {
      throw new BadRequestException('Invite is not for this campaign');
    }

    // Check that the invite is for the user
    if (invite.userId !== user.id && invite.email !== user.email) {
      throw new BadRequestException('Invite is not for this user');
    }

    // Check that the user is not already in the campaign
    const memberships = await this.membershipsService.getCampaignMemberships(invite.campaignId);
    memberships.forEach((membership) => {
      if (membership.user.id === user.id) {
        throw new ConflictException('User already in campaign');
      }
    });

    // Get the role from the token payload
    const payload = invite.payload as Prisma.JsonObject;
    const role = (payload?.role as Role) || Role.PLAYER;

    // Create the membership
    await this.membershipsService.createMembership({
      userId: user.id,
      campaignId: invite.campaignId,
      role,
    });

    // Delete and return the invite
    const deletedInvite = await this.invitesService.deleteInvite(invite);

    // Return the deleted invite
    return deletedInvite;
  }

  /**
   * Decline a campaign invite
   * @param params - The campaign's id and invite's id
   * @returns The declined invite
   */
  @Post(':inviteId/decline')
  async declineInvite(@Param() params: ConnectCampaignInviteDto, @User() user: UserEntity): Promise<ActionTokenEntity> {
    // Check that the campaign exists
    const campaign = await this.campaignsService.getCampaignById(params.campaignId);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Check that invite exists
    const invite = await this.invitesService.getInviteById(params.inviteId);
    if (!invite) {
      throw new NotFoundException('Invalid or expired token');
    }

    // Check that invite belongs to the campaign
    if (invite.campaignId !== params.campaignId) {
      throw new BadRequestException('Invite is not for this campaign');
    }

    // Check that the invite is for the user
    if (invite.userId !== user.id && invite.email !== user.email) {
      throw new BadRequestException('Invite is not for this user');
    }

    // Delete and return the invite
    const deletedInvite = await this.invitesService.deleteInvite(invite);

    // Return the deleted invite
    return deletedInvite;
  }
}
