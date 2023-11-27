import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { UserEntity } from '../users/entities/user.entity';
import { CampaignsGateway } from './campaigns.gateway';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignEntity } from './entities/campaign.entity';

@Injectable()
export class CampaignsService {
  private logger: Logger = new Logger(CampaignsService.name);

  constructor(
    private prisma: PrismaService,
    private campaignsGateway: CampaignsGateway,
  ) {}

  /**
   * Get all campaigns that a user is a member of
   * @param userId - The user's id
   * @returns All campaigns that a user is a member of
   */
  async getCampaignsByUserId(userId: string): Promise<CampaignEntity[]> {
    this.logger.verbose(`📂 Getting campaigns for user "${userId}"`);

    try {
      // User must be the creator of the campaign or a player
      const campaigns = await this.prisma.campaign.findMany({
        where: { memberships: { some: { userId } } },
        include: {
          memberships: { include: { user: { include: { avatar: true } } }, orderBy: { createdAt: 'asc' } },
          characters: { include: { controlledBy: { include: { avatar: true } }, media: true } },
          createdBy: { include: { avatar: true } },
          invites: true,
          maps: { include: { media: true } },
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
   * Get all campaigns that a user is the creator of
   * @param userId - The user's id
   * @returns All campaigns that a user is the creator of
   */
  async getCampaignsCreatedByUserId(userId: string): Promise<CampaignEntity[]> {
    this.logger.verbose(`📂 Getting created campaigns for user "${userId}"`);

    try {
      // Get the campaigns
      const campaigns = await this.prisma.campaign.findMany({
        where: { createdById: userId },
        include: {
          memberships: { include: { user: { include: { avatar: true } } } },
          characters: { include: { controlledBy: { include: { avatar: true } }, media: true } },
          createdBy: { include: { avatar: true } },
          invites: true,
          maps: { include: { media: true } },
        },
        orderBy: { createdAt: 'asc' },
      });
      this.logger.debug(`✅️ Found ${campaigns.length} created campaigns for user "${userId}"`);
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
  async getCampaignById(campaignId: string): Promise<CampaignEntity> {
    this.logger.verbose(`📂 Getting campaign "${campaignId}"`);
    try {
      // Get the campaign
      const campaign = await this.prisma.campaign.findUniqueOrThrow({
        where: { id: campaignId },
        include: {
          memberships: { include: { user: { include: { avatar: true } } } },
          characters: { include: { controlledBy: { include: { avatar: true } }, media: true } },
          createdBy: { include: { avatar: true } },
          invites: true,
          maps: { include: { media: true } },
        },
      });
      this.logger.debug(`✅️ Found campaign "${campaignId}"`);
      return campaign;
    } catch (error) {
      this.logger.error(`🚨 Campaign "${campaignId}" not found`, error);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Create a new campaign
   * @param data - The campaign's data
   * @returns The created campaign
   */
  async createCampaign(data: CreateCampaignDto): Promise<CampaignEntity> {
    this.logger.verbose(`📂 Creating campaign "${data.name}"`);
    try {
      // Create the campaign
      const campaign = await this.prisma.campaign.create({
        data: {
          name: data.name,
          createdById: data.createdById,
          memberships: { create: { userId: data.createdById, role: Role.GAME_MASTER } },
        },
        include: {
          memberships: { include: { user: { include: { avatar: true } } } },
          characters: { include: { controlledBy: { include: { avatar: true } }, media: true } },
          createdBy: { include: { avatar: true } },
          invites: true,
          maps: { include: { media: true } },
        },
      });

      // Send the campaign to the client
      this.campaignsGateway.createCampaign(campaign);

      this.logger.debug(`✅️ Created campaign "${campaign.id}"`);
      return campaign;
    } catch (error) {
      this.logger.error(error.message);
      throw new ConflictException(error.message);
    }
  }

  /**
   * Update a campaign
   * @param campaignId - The campaign's id
   * @param data - The campaign's data
   * @returns The updated campaign
   */
  async updateCampaign(campaignId: string, data: UpdateCampaignDto): Promise<CampaignEntity> {
    this.logger.verbose(`📂 Updating campaign "${campaignId}"`);
    try {
      // Update the campaign
      const campaign = await this.prisma.campaign.update({
        where: { id: campaignId },
        data: {
          name: data.name,
        },
        include: {
          memberships: { include: { user: { include: { avatar: true } } } },
          characters: { include: { controlledBy: { include: { avatar: true } }, media: true } },
          createdBy: { include: { avatar: true } },
          invites: true,
          maps: { include: { media: true } },
        },
      });

      // Send the campaign to the client
      this.campaignsGateway.updateCampaign(campaign);

      this.logger.debug(`✅️ Updated campaign "${campaignId}"`);
      return campaign;
    } catch (error) {
      this.logger.error(`🚨 Campaign "${campaignId}" not found`, error);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete a campaign
   * @param campaignId - The campaign's id
   * @returns The deleted campaign
   */
  async deleteCampaign(campaignId: string): Promise<CampaignEntity> {
    this.logger.verbose(`📂 Deleting campaign "${campaignId}"`);
    try {
      // Delete the campaign
      const campaign = await this.prisma.campaign.delete({ where: { id: campaignId } });

      // Send the campaign to the client
      this.campaignsGateway.deleteCampaign(campaign);

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
   * @param user - The user that reordered the campaigns
   * @returns The updated campaigns in the new order
   */
  async reorderCampaigns(campaignIds: string[], user: UserEntity): Promise<CampaignEntity[]> {
    this.logger.verbose(`📂 Reordering campaigns for user "${user.id}"`);
    try {
      // Update the user's campaign order
      await this.prisma.user.update({ where: { id: user.id }, data: { campaignOrder: campaignIds } });

      // Send the reordered campaigns to the client
      this.campaignsGateway.reorderCampaigns(campaignIds, user);

      // Return the campaigns in the new order
      this.logger.debug(`✅️ Reordered campaigns for user "${user.id}"`);
      return this.getCampaignsByUserId(user.id);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Reorder maps for a campaign
   * @param campaignId - The campaign id
   * @param mapIds - The map ids
   * @returns The updated maps in the new order
   */
  async reorderMaps(campaignId: string, mapIds: string[]): Promise<void> {
    this.logger.verbose(`📂 Reordering maps for campaign "${campaignId}"`);
    try {
      // Update the map order
      await this.prisma.$transaction(
        mapIds.map((id, index) =>
          this.prisma.map.update({
            where: { id },
            data: { order: index },
          }),
        ),
      );

      // Emit the updated maps to the campaign's room
      this.campaignsGateway.reorderMaps({ campaignId, mapIds });
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
