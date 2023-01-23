import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CAMPAIGN_INVITE_SAFE_FIELDS } from './campaign-invites.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignBaseEntity } from './entities/campaign-base.entity';
import { CampaignEntity } from './entities/campaign.entity';

@Injectable()
export class CampaignsService {
  private logger: Logger = new Logger(CampaignsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get all campaigns for a given user
   * @param userId - The user's id
   * @returns The user's campaigns
   */
  async getUserCampaigns(userId: string): Promise<CampaignEntity[]> {
    this.logger.verbose(`📂 Getting campaigns for user "${userId}"`);
    try {
      // User must be the creator of the campaign or a player
      const campaigns = await this.prisma.campaign.findMany({
        where: { OR: [{ createdById: userId }, { members: { some: { userId } } }] },
        include: {
          members: { include: { user: { include: { avatar: true } } } },
          characters: { include: { controlledBy: true, media: true } },
          createdBy: { include: { avatar: true } },
          invites: { select: CAMPAIGN_INVITE_SAFE_FIELDS },
        },
        orderBy: { createdAt: 'asc' },
      });
      // Get the user
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      // Sort the campaigns by the user's campaign order
      campaigns.sort((a, b) => {
        const aOrder = user.campaignOrder.findIndex((campaignId) => campaignId === a.id);
        const bOrder = user.campaignOrder.findIndex((campaignId) => campaignId === b.id);
        // If the user has no campaign order or the campaign is not in the order, sort by creation date
        if (aOrder === -1 || bOrder === -1) {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        // Sort by the user's campaign order
        return aOrder - bOrder;
      });

      this.logger.debug(`✅️ Found ${campaigns.length} campaigns for user "${userId}"`);
      return campaigns;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get a campaign by its id
   * @param campaignId - The campaign's id
   * @returns The campaign
   */
  async getCampaign(campaignId: string): Promise<CampaignEntity> {
    this.logger.verbose(`📂 Getting campaign "${campaignId}"`);
    try {
      // Get the campaign
      const campaign = await this.prisma.campaign.findUniqueOrThrow({
        where: { id: campaignId },
        include: {
          members: { include: { user: { include: { avatar: true } } } },
          characters: { include: { controlledBy: true, media: true } },
          createdBy: { include: { avatar: true } },
          invites: { select: CAMPAIGN_INVITE_SAFE_FIELDS },
        },
      });
      this.logger.debug(`✅️ Found campaign "${campaignId}"`);
      return campaign;
    } catch (error) {
      this.logger.error(`🚨 Campaign "${campaignId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get campaign count
   * @returns Campaign count
   */
  async getCampaignCount(): Promise<number> {
    this.logger.verbose(`📂 Getting campaign count`);
    try {
      // Get the campaign count
      const count = await this.prisma.campaign.count();
      this.logger.debug(`✅️ Found ${count} campaigns`);
      return count;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Create a new campaign
   * @param data - The campaign's data
   * @param createdById - The user's id
   * @returns The created campaign
   */
  async createCampaign(data: CreateCampaignDto, createdById: string): Promise<CampaignBaseEntity> {
    this.logger.verbose(`📂 Creating campaign "${data.name}"`);
    try {
      // Create the campaign
      const campaign = await this.prisma.campaign.create({
        data: {
          name: data.name,
          createdBy: { connect: { id: createdById } },
        },
      });
      this.logger.debug(`✅️ Created campaign "${campaign.id}"`);
      return campaign;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Update a campaign
   * @param campaignId - The campaign's id
   * @param data - The campaign's data
   * @returns The updated campaign
   */
  async updateCampaign(campaignId: string, data: UpdateCampaignDto): Promise<CampaignBaseEntity> {
    this.logger.verbose(`📂 Updating campaign "${campaignId}"`);
    try {
      // Update the campaign
      const campaign = await this.prisma.campaign.update({
        where: { id: campaignId },
        data: {
          name: data.name,
          members: { connect: data.members },
        },
      });
      this.logger.debug(`✅️ Updated campaign "${campaignId}"`);
      return campaign;
    } catch (error) {
      this.logger.error(`🚨 Campaign "${campaignId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete a campaign
   * @param campaignId - The campaign's id
   * @returns The deleted campaign
   */
  async deleteCampaign(campaignId: string): Promise<CampaignBaseEntity> {
    this.logger.verbose(`📂 Deleting campaign "${campaignId}"`);
    try {
      // Delete the campaign
      const campaign = await this.prisma.campaign.delete({ where: { id: campaignId } });
      this.logger.debug(`✅️ Deleted campaign "${campaignId}"`);
      return campaign;
    } catch (error) {
      this.logger.error(`🚨 Campaign "${campaignId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Reorder campaigns
   * @param campaignIds - The campaign ids
   * @param userId - The user's id
   * @returns The updated campaigns in the new order
   */
  async reorderCampaigns(campaignIds: string[], userId: string): Promise<CampaignEntity[]> {
    this.logger.verbose(`📂 Reordering campaigns for user "${userId}"`);
    try {
      // Update the user's campaign order
      await this.prisma.user.update({ where: { id: userId }, data: { campaignOrder: campaignIds } });
      this.logger.debug(`✅️ Reordered campaigns for user "${userId}"`);
      // Return the campaigns in the new order
      return this.getUserCampaigns(userId);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
