import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ActionTokenType, Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { ActionTokensService } from '../../../action-tokens/action-tokens.service';
import { ActionTokenEntity } from '../../../action-tokens/entities/action-token.entity';
import { durationToDate } from '../../../helpers';
import { NotificationTypeEnum } from '../../../notifications/notification-type.enum';
import { NotificationsGateway } from '../../../notifications/notifications.gateway';
import { CreateInviteServiceDto } from './dto/create-invite-service.dto';
import { InvitesGateway } from './invites.gateway';

@Injectable()
export class InvitesService {
  private logger: Logger = new Logger(InvitesService.name);

  constructor(
    private prisma: PrismaService,
    private invitesGateway: InvitesGateway,
    private notificationsGateway: NotificationsGateway,
    private actionTokensService: ActionTokensService,
  ) {}

  /**
   * Get a campaign's invites
   * @param campaignId - The campaign's id
   * @returns Campaign invites
   */
  async getInvitesByCampaignId(campaignId: string): Promise<ActionTokenEntity[]> {
    this.logger.verbose(`📂 Getting campaign "${campaignId}" invites`);
    try {
      // Get the invites
      const invites = await this.prisma.actionToken.findMany({
        where: { campaignId, type: ActionTokenType.INVITE },
        orderBy: { createdAt: 'asc' },
      });
      this.logger.debug(`✅️ Found campaign "${campaignId}" invites`);
      return invites;
    } catch (error) {
      this.logger.error(`🚨 Failed to get campaign "${campaignId}" invites`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get a campaign's invite by id
   * @param id - The invite's id
   * @returns The invite
   */
  async getInviteById(id: string): Promise<ActionTokenEntity> {
    if (!id) {
      throw new BadRequestException('Invalid or expired token');
    }

    this.logger.verbose(`📂 Getting invite "${id}"`);
    try {
      // Get the invite
      const invite = await this.prisma.actionToken.findFirst({
        where: { id, type: ActionTokenType.INVITE, expiresAt: { gte: new Date() } },
      });

      if (!invite) {
        this.logger.error(`🚨 Failed to get invite "${id}"`);
        return null;
      }

      // Return the invite
      this.logger.debug(`✅️ Found invite "${id}"`);
      return invite;
    } catch (error) {
      this.logger.error(`🚨 Failed to get invite "${id}"`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Create a campaign invite
   * @param invite - The invite to create
   * @returns The created invite
   */
  async createInvite(invite: CreateInviteServiceDto): Promise<ActionTokenEntity> {
    // Create the invite
    const createdInvite = await this.actionTokensService.createToken({
      type: ActionTokenType.INVITE,
      email: invite.email,
      payload: { role: Role.PLAYER },
      expiresAt: durationToDate('7d'),
      userId: invite.userId,
      campaignId: invite.campaign.id,
    });

    // Emit the new invite to the campaign's room and the user's room
    this.invitesGateway.createInvite(createdInvite);

    // Send the notification to the user
    if (invite.userId) {
      this.notificationsGateway.createNotification({
        userId: invite.userId,
        type: NotificationTypeEnum.INVITE,
        data: { ...createdInvite, campaign: invite.campaign },
      });
    }

    // Return the created invite
    return createdInvite;
  }

  /**
   * Delete a campaign invite
   * @param invite - The invite to delete
   * @returns The deleted invite
   */
  async deleteInvite(invite: ActionTokenEntity): Promise<ActionTokenEntity> {
    // Delete the invite
    const deletedInvite = await this.actionTokensService.deleteToken(invite.id);

    // Emit the deleted invite to the campaign's room and the user's room
    this.invitesGateway.deleteInvite(deletedInvite);

    // Delete the notification from the user
    this.notificationsGateway.deleteNotification({
      userId: deletedInvite.userId,
      type: NotificationTypeEnum.INVITE,
      data: deletedInvite,
    });

    // Return the deleted invite
    return deletedInvite;
  }
}
