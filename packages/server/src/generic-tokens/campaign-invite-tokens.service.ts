import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CampaignInviteToken, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { config } from '../config';
import { excludeFields, toMillisecondsFromString } from '../helpers';
import { CampaignInviteDto } from './dto/campaign-invite.dto';
import { GenericTokensService } from './generic-tokens.service';

export const CAMPAIGN_INVITE_TOKEN_SAFE_FIELDS = excludeFields({ ...Prisma.CampaignInviteTokenScalarFieldEnum }, [
  'value',
]);

@Injectable()
export class CampaignInviteTokensService {
  private logger: Logger = new Logger(CampaignInviteTokensService.name);

  constructor(private prisma: PrismaService, private readonly genericTokensService: GenericTokensService) {}

  /**
   * Get token by value
   * @param value - The token's value
   * @returns The token
   */
  async getToken(value: string): Promise<CampaignInviteToken> {
    this.logger.verbose(`📂 Getting campaign invite token by value "${value}"`);
    try {
      // Ensure the token exists
      const token = await this.prisma.campaignInviteToken.findUniqueOrThrow({ where: { value } });
      this.logger.debug(`✅️ Found campaign invite token by value "${value}"`);
      // Return the  token
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to get campaign invite token by value "${value}"`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Create a new token for campaign invite
   * @param data - The token's data
   * @returns The created token
   */
  async createToken(data: CampaignInviteDto): Promise<CampaignInviteToken> {
    this.logger.verbose(`📂 Creating campaign invite token for campaign "${data.campaignId}"`);
    try {
      // Create the token
      const token = await this.prisma.campaignInviteToken.create({
        data: {
          value: this.genericTokensService.generateToken({ userId: data.userId, campaignId: data.campaignId }),
          userId: data.userId,
          campaignId: data.campaignId,
        },
      });
      this.logger.debug(`✅️ Created campaign invite token for campaign "${data.campaignId}"`);
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to create campaign invite token for campaign "${data.campaignId}"`);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete token by value
   * @param value - The token's value
   * @returns Deleted token
   */
  async deleteToken(value: string): Promise<CampaignInviteToken> {
    this.logger.verbose(`📂 Deleting campaign invite token by value "${value}"`);
    try {
      // Delete the token
      const token = await this.prisma.campaignInviteToken.delete({ where: { value } });
      this.logger.debug(`✅️ Deleted campaign invite token by value "${value}"`);
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to delete campaign invite token by value "${value}"`);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Remove old tokens at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeOldTokens(): Promise<void> {
    this.logger.verbose(`📂 Removing old campaign invite tokens`);
    // Convert the expiration time to milliseconds
    const expirationTime = toMillisecondsFromString(config.JWT_GENERIC_TOKEN_EXPIRATION_TIME);
    // Get the expiry date by subtracting the expiration time from the current date
    const expiryDate = new Date(Date.now() - expirationTime);
    // Delete the campaign invite tokens
    await this.prisma.campaignInviteToken.deleteMany({ where: { createdAt: { lte: expiryDate } } });
    this.logger.debug(`✅️ Removed old campaign invite tokens`);
  }
}
