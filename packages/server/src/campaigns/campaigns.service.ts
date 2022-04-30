import { Injectable, NotFoundException } from '@nestjs/common';
import { Campaign, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async campaign(campaignWhereUniqueInput: Prisma.CampaignWhereUniqueInput) {
    try {
      return await this.prisma.campaign.findUnique({
        where: campaignWhereUniqueInput,
        include: {
          maps: {
            include: {
              media: true,
            },
          },
          players: true,
        },
        rejectOnNotFound: true,
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async campaigns(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CampaignWhereUniqueInput;
    where?: Prisma.CampaignWhereInput;
    orderBy?: Prisma.CampaignOrderByWithRelationInput;
  }): Promise<Campaign[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.campaign.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        maps: {
          include: {
            media: true,
          },
        },
        players: true,
      },
    });
  }

  async createCampaign(data: Prisma.CampaignCreateInput) {
    return this.prisma.campaign.create({ data });
  }

  async updateCampaign(params: { where: Prisma.CampaignWhereUniqueInput; data: Prisma.CampaignUpdateInput }) {
    const { data, where } = params;
    return this.prisma.campaign.update({ data, where });
  }

  async deleteCampaign(where: Prisma.CampaignWhereUniqueInput) {
    return this.prisma.campaign.delete({ where });
  }
}
