import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { USER_SAFE_FIELDS } from '../users/users.service';
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
   * @param userId The user's id
   * @returns The user's campaigns
   */
  async getUserCampaigns(userId: string): Promise<CampaignEntity[]> {
    this.logger.verbose(`📂 Getting campaigns for user "${userId}"`);
    try {
      // User must be the creator of the campaign or a player
      const campaigns = await this.prisma.campaign.findMany({
        where: { OR: [{ createdById: userId }, { players: { some: { id: userId } } }] },
        include: {
          maps: { include: { media: true } },
          players: { select: USER_SAFE_FIELDS },
          playerCharacters: { include: { controlledBy: true, media: true } },
          nonPlayerCharacters: { include: { controlledBy: true, media: true } },
          createdBy: { select: USER_SAFE_FIELDS },
        },
        orderBy: { updatedAt: 'desc' },
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
   * @param campaignId The campaign's id
   * @returns The campaign
   */
  async getCampaign(campaignId: string): Promise<CampaignEntity> {
    this.logger.verbose(`📂 Getting campaign "${campaignId}"`);
    try {
      // Get the campaign
      const campaign = await this.prisma.campaign.findUniqueOrThrow({
        where: { id: campaignId },
        include: {
          maps: { include: { media: true } },
          players: { select: USER_SAFE_FIELDS },
          playerCharacters: { include: { controlledBy: true, media: true } },
          nonPlayerCharacters: { include: { controlledBy: true, media: true } },
          createdBy: { select: USER_SAFE_FIELDS },
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
   * @param data The campaign's data
   * @param createdById The user's id
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
   * @param campaignId The campaign's id
   * @param data The campaign's data
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
          players: { connect: data.players },
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
   * @param campaignId The campaign's id
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
}
