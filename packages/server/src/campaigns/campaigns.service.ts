import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

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
   */
  async getUserCampaigns(userId: string): Promise<CampaignEntity[]> {
    this.logger.verbose(`📂 Getting campaigns for user "${userId}"`);
    try {
      // User must be the creator of the campaign or a player
      const campaigns = await this.prisma.campaign.findMany({
        where: { OR: [{ createdById: userId }, { players: { some: { id: userId } } }] },
        include: {
          maps: { include: { media: true } },
          players: true,
          playerCharacters: { include: { controlledBy: true, media: true } },
          nonPlayerCharacters: { include: { controlledBy: true, media: true } },
          createdBy: true,
        },
      });
      this.logger.verbose(`✅️ Found ${campaigns.length} campaigns for user "${userId}"`);
      return campaigns;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get a campaign by its id
   */
  async getCampaign(campaignId: string): Promise<CampaignEntity> {
    this.logger.verbose(`📂 Getting campaign "${campaignId}"`);
    try {
      // Get the campaign
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          maps: { include: { media: true } },
          players: true,
          playerCharacters: { include: { controlledBy: true, media: true } },
          nonPlayerCharacters: { include: { controlledBy: true, media: true } },
          createdBy: true,
        },
        rejectOnNotFound: true,
      });
      this.logger.verbose(`✅️ Found campaign "${campaignId}"`);
      return campaign;
    } catch (error) {
      this.logger.error(`🚨 Campaign "${campaignId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Create a new campaign
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
      this.logger.verbose(`✅️ Created campaign "${campaign.id}"`);
      return campaign;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Update a campaign
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
      this.logger.verbose(`✅️ Updated campaign "${campaignId}"`);
      return campaign;
    } catch (error) {
      this.logger.error(`🚨 Campaign "${campaignId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(campaignId: string): Promise<CampaignBaseEntity> {
    this.logger.verbose(`📂 Deleting campaign "${campaignId}"`);
    try {
      // Delete the campaign
      const campaign = await this.prisma.campaign.delete({ where: { id: campaignId } });
      this.logger.verbose(`✅️ Deleted campaign "${campaignId}"`);
      return campaign;
    } catch (error) {
      this.logger.error(`🚨 Campaign "${campaignId}" not found`);
      throw new NotFoundException(error.message);
    }
  }
}
