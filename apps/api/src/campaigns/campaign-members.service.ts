import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateCampaignMemberDto } from './dto/create-campaign-member.dto';
import { UpdateCampaignMemberDto } from './dto/update-campaign-member.dto';
import { CampaignMemberEntity } from './entities/campaign-member.entity';

@Injectable()
export class CampaignMembersService {
  private logger: Logger = new Logger(CampaignMembersService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get member of a campaign
   * @param campaignId - The campaign's id
   * @param memberId - The member's id
   * @returns The member
   */
  async getMember(campaignId: string, memberId: string): Promise<CampaignMemberEntity> {
    this.logger.verbose(`📂 Getting campaign member "${memberId}" for campaign "${campaignId}"`);
    try {
      // Get the member
      const member = await this.prisma.campaignMember.findFirst({
        where: { campaignId, userId: memberId },
        include: { user: { include: { avatar: true } } },
      });
      this.logger.debug(`✅️ Got campaign member "${memberId}" for campaign "${campaignId}"`);
      return member;
    } catch (error) {
      this.logger.error(`🚨 Failed to get campaign member "${memberId}" for campaign "${campaignId}"`);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Create a new member for a campaign
   * @param data - The member's data
   * @returns The created member
   */
  async createMember(data: CreateCampaignMemberDto): Promise<CampaignMemberEntity> {
    this.logger.verbose(`📂 Creating campaign member for campaign "${data.campaignId}"`);
    try {
      // Create the member
      const member = await this.prisma.campaignMember.create({
        data: {
          user: { connect: { id: data.userId } },
          campaign: { connect: { id: data.campaignId } },
        },
        include: { user: { include: { avatar: true } } },
      });
      this.logger.debug(`✅️ Created campaign member for campaign "${data.campaignId}"`);
      return member;
    } catch (error) {
      this.logger.error(`🚨 Failed to create campaign member for campaign "${data.campaignId}"`);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Update a member of a campaign
   * @param memberId - The member's id
   * @param data - The member's data
   * @returns The updated member
   */
  async updateMember(memberId: string, data: UpdateCampaignMemberDto): Promise<CampaignMemberEntity> {
    this.logger.verbose(`📂 Updating campaign member "${memberId}"`);
    try {
      // Update the member
      const member = await this.prisma.campaignMember.update({
        where: { id: memberId },
        data: { role: data.role },
        include: { user: { include: { avatar: true } } },
      });
      this.logger.debug(`✅️ Updated campaign member "${memberId}"`);
      return member;
    } catch (error) {
      this.logger.error(`🚨 Failed to update campaign member "${memberId}"`);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete a member from a campaign
   * @param memberId - The member's id
   * @returns The deleted member
   */
  async deleteMember(memberId: string): Promise<CampaignMemberEntity> {
    this.logger.verbose(`📂 Deleting campaign member "${memberId}"`);
    try {
      // Delete the member
      const member = await this.prisma.campaignMember.delete({
        where: { id: memberId },
        include: { user: { include: { avatar: true } } },
      });
      this.logger.debug(`✅️ Deleted campaign member "${memberId}"`);
      return member;
    } catch (error) {
      this.logger.error(`🚨 Failed to delete campaign member "${memberId}"`);
      throw new InternalServerErrorException(error.message);
    }
  }
}
