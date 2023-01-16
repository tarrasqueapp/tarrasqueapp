import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CampaignInvite, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { GenericTokensService } from '../generic-tokens/generic-tokens.service';
import { excludeFields } from '../helpers';
import { CreateCampaignInviteDto } from './dto/create-campaign-invite.dto';

export const CAMPAIGN_INVITE_SAFE_FIELDS = excludeFields({ ...Prisma.CampaignInviteScalarFieldEnum }, ['value']);

@Injectable()
export class CampaignInvitesService {
  private logger: Logger = new Logger(CampaignInvitesService.name);

  constructor(private prisma: PrismaService, private readonly genericTokensService: GenericTokensService) {}

  /**
   * Get invite by value
   * @param value - The invite's value
   * @returns The invite
   */
  async getInvite(value: string): Promise<CampaignInvite> {
    this.logger.verbose(`📂 Getting campaign invite by value "${value}"`);
    try {
      // Ensure the invite exists
      const invite = await this.prisma.campaignInvite.findUniqueOrThrow({ where: { value } });
      this.logger.debug(`✅️ Found campaign invite by value "${value}"`);
      // Return the  invite
      return invite;
    } catch (error) {
      this.logger.error(`🚨 Failed to get campaign invite by value "${value}"`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get invites by user id
   * @param userId - The user's id
   * @returns The invites
   */
  async getInvitesByUserId(userId: string): Promise<CampaignInvite[]> {
    this.logger.verbose(`📂 Getting campaign invites by user id "${userId}"`);
    try {
      // Get the invites
      const invites = await this.prisma.campaignInvite.findMany({ where: { userId }, include: { campaign: true } });
      this.logger.debug(`✅️ Found ${invites.length} campaign invites by user id "${userId}"`);
      // Return the invites
      return invites;
    } catch (error) {
      this.logger.error(`🚨 Failed to get campaign invites by user id "${userId}"`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Assign invites matching an email to a user
   * @param email - The user's email
   * @param userId - The user's id
   * @returns The updated invites
   */
  async assignInvitesToUser(email: string, userId: string): Promise<CampaignInvite[]> {
    this.logger.verbose(`📂 Assigning campaign invites of email "${email}" to user "${userId}"`);
    try {
      // Update the invites
      const invites = await this.prisma.campaignInvite.updateMany({
        where: { email },
        data: { userId },
      });
      this.logger.debug(`✅️ Assigned ${invites.count} campaign invites of email "${email}" to user "${userId}"`);
      // Return the invites
      const updatedInvites = await this.prisma.campaignInvite.findMany({ where: { email } });
      return updatedInvites;
    } catch (error) {
      this.logger.error(`🚨 Failed to assign campaign invites of email "${email}" to user "${userId}"`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Create a new invite for campaign invite
   * @param data - The invite's data
   * @returns The created invite
   */
  async createInvite(data: CreateCampaignInviteDto): Promise<CampaignInvite> {
    this.logger.verbose(`📂 Creating campaign invite for campaign "${data.campaignId}"`);
    try {
      // Create the invite
      const invite = await this.prisma.campaignInvite.create({
        data: {
          email: data.email,
          value: this.genericTokensService.generateToken({ userId: data.userId, campaignId: data.campaignId }),
          userId: data.userId,
          campaignId: data.campaignId,
        },
      });
      this.logger.debug(`✅️ Created campaign invite for campaign "${data.campaignId}"`);
      return invite;
    } catch (error) {
      this.logger.error(`🚨 Failed to create campaign invite for campaign "${data.campaignId}"`);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete invite
   * @param id - The invite's id
   * @returns Deleted invite
   */
  async deleteInvite(id: string): Promise<CampaignInvite> {
    this.logger.verbose(`📂 Deleting campaign invite "${id}"`);
    try {
      // Delete the invite
      const invite = await this.prisma.campaignInvite.delete({ where: { id } });
      this.logger.debug(`✅️ Deleted campaign invite "${id}"`);
      return invite;
    } catch (error) {
      this.logger.error(`🚨 Failed to delete campaign invite "${id}"`);
      throw new InternalServerErrorException(error.message);
    }
  }
}
