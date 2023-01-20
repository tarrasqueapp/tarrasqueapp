import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailVerificationToken } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { config } from '../config';
import { toMillisecondsFromString } from '../helpers';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { GenericTokensService } from './generic-tokens.service';

@Injectable()
export class EmailVerificationTokensService {
  private logger: Logger = new Logger(EmailVerificationTokensService.name);

  constructor(private prisma: PrismaService, private readonly genericTokensService: GenericTokensService) {}

  /**
   * Get token by value
   * @param value - The token's value
   * @returns The token
   */
  async getToken(value: string): Promise<EmailVerificationToken> {
    this.logger.verbose(`📂 Getting email verification token by value "${value}"`);
    try {
      // Ensure the token exists
      const token = await this.prisma.emailVerificationToken.findUniqueOrThrow({ where: { value } });
      this.logger.debug(`✅️ Found email verification token by value "${value}"`);
      // Return the token
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to get email verification token by value "${value}"`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get token by user id
   * @param userId - The user's id
   * @returns The token
   */
  async getTokenByUserId(userId: string): Promise<EmailVerificationToken> {
    this.logger.verbose(`📂 Getting email verification token for user id "${userId}"`);
    try {
      // Get the token
      const token = await this.prisma.emailVerificationToken.findFirst({ where: { userId } });
      this.logger.debug(`✅️ Found email verification token for user id "${userId}"`);
      // Return the token
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to get email verification token for user id "${userId}"`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Create a new token for email verification
   * @param data - The token's data
   * @returns The created token
   */
  async createToken(data: EmailVerificationDto): Promise<EmailVerificationToken> {
    this.logger.verbose(`📂 Creating email verification token for user "${data.userId}"`);
    try {
      // Delete any existing tokens for the user
      await this.prisma.emailVerificationToken.deleteMany({ where: { userId: data.userId } });
      // Create the token
      const token = await this.prisma.emailVerificationToken.create({
        data: {
          value: this.genericTokensService.generateToken({ userId: data.userId }),
          userId: data.userId,
        },
      });
      this.logger.debug(`✅️ Created email verification token for user "${data.userId}"`);
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to create email verification token for user "${data.userId}"`);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete token by value
   * @param value - The token's value
   * @returns Deleted token
   */
  async deleteToken(value: string): Promise<EmailVerificationToken> {
    this.logger.verbose(`📂 Deleting email verification token by value "${value}"`);
    try {
      // Delete the token
      const token = await this.prisma.emailVerificationToken.delete({ where: { value } });
      this.logger.debug(`✅️ Deleted email verification token by value "${value}"`);
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to delete email verification token by value "${value}"`);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Remove old tokens at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeOldTokens(): Promise<void> {
    this.logger.verbose(`📂 Removing old email verification tokens`);
    // Convert the expiration time to milliseconds
    const expirationTime = toMillisecondsFromString(config.JWT_GENERIC_TOKEN_EXPIRATION_TIME);
    // Get the expiry date by subtracting the expiration time from the current date
    const expiryDate = new Date(Date.now() - expirationTime);
    // Delete the email verification tokens
    await this.prisma.emailVerificationToken.deleteMany({ where: { createdAt: { lte: expiryDate } } });
    this.logger.debug(`✅️ Removed old email verification tokens`);
  }
}
