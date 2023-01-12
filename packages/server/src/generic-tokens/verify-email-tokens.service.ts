import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VerifyEmailToken } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { config } from '../config';
import { toMillisecondsFromString } from '../helpers';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { GenericTokensService } from './generic-tokens.service';

@Injectable()
export class VerifyEmailTokensService {
  private logger: Logger = new Logger(VerifyEmailTokensService.name);

  constructor(private prisma: PrismaService, private readonly genericTokensService: GenericTokensService) {}

  /**
   * Get token by value
   * @param value - The token's value
   * @returns The token
   */
  async getToken(value: string): Promise<VerifyEmailToken> {
    this.logger.verbose(`📂 Getting verify email token by value "${value}"`);
    try {
      // Ensure the token exists
      const token = await this.prisma.verifyEmailToken.findUniqueOrThrow({ where: { value } });
      this.logger.debug(`✅️ Found verify email token by value "${value}"`);
      // Return the  token
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to get verify email token by value "${value}"`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Create a new token for email verification
   * @param data - The token's data
   * @returns The created token
   */
  async createToken(data: VerifyEmailDto): Promise<VerifyEmailToken> {
    this.logger.verbose(`📂 Creating verify email token for user "${data.userId}"`);
    try {
      // Delete any existing tokens for the user
      await this.prisma.verifyEmailToken.deleteMany({ where: { userId: data.userId } });
      // Create the token
      const token = await this.prisma.verifyEmailToken.create({
        data: {
          value: this.genericTokensService.generateToken({ userId: data.userId }),
          userId: data.userId,
        },
      });
      this.logger.debug(`✅️ Created verify email token for user "${data.userId}"`);
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to create verify email token for user "${data.userId}"`);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete token by value
   * @param value - The token's value
   * @returns Deleted token
   */
  async deleteToken(value: string): Promise<VerifyEmailToken> {
    this.logger.verbose(`📂 Deleting verify email token by value "${value}"`);
    try {
      // Delete the token
      const token = await this.prisma.verifyEmailToken.delete({ where: { value } });
      this.logger.debug(`✅️ Deleted verify email token by value "${value}"`);
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to delete verify email token by value "${value}"`);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Remove old tokens at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeOldTokens(): Promise<void> {
    this.logger.verbose(`📂 Removing old verify email tokens`);
    // Convert the expiration time to milliseconds
    const expirationTime = toMillisecondsFromString(config.JWT_GENERIC_TOKEN_EXPIRATION_TIME);
    // Get the expiry date by subtracting the expiration time from the current date
    const expiryDate = new Date(Date.now() - expirationTime);
    // Delete the verify email tokens
    await this.prisma.verifyEmailToken.deleteMany({ where: { createdAt: { lte: expiryDate } } });
    this.logger.debug(`✅️ Removed old verify email tokens`);
  }
}
