import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ActionTokenType } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { ActionTokenEntity } from '../../../action-tokens/entities/action-token.entity';

@Injectable()
export class InvitesService {
  private logger: Logger = new Logger(InvitesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get a campaign's invites
   * @param campaignId - The campaign's id
   * @returns Campaign invites
   */
  async getCampaignInvites(campaignId: string): Promise<ActionTokenEntity[]> {
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
}
