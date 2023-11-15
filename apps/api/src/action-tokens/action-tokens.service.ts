import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ActionTokenType, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { config } from '@tarrasque/common';

import { CreateActionTokenDto } from './dto/create-action-token.dto';
import { ActionTokenEntity } from './entities/action-token.entity';
import { TokenPayload } from './token-payload.interface';

@Injectable()
export class ActionTokensService {
  private logger: Logger = new Logger(ActionTokensService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Get a token by id
   * @param id - The token id
   * @returns The token
   */
  async getTokenById(id: string, type?: ActionTokenType): Promise<ActionTokenEntity | null> {
    if (!id) {
      throw new BadRequestException('Invalid or expired token');
    }
    this.logger.verbose(`📂 Getting token "${id}"`);
    try {
      // Get the token
      const token = await this.prisma.actionToken.findFirst({ where: { id, type, expiresAt: { gte: new Date() } } });

      if (!token) {
        this.logger.error(`🚨 Failed to get token "${id}"`);
        return null;
      }

      // Return the token
      this.logger.debug(`✅️ Found token "${id}"`);
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to get token "${id}"`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get tokens by user id
   * @param userId - The user id
   * @param type - The token type
   * @returns The tokens
   */
  async getTokensByUserId(userId: string, type?: ActionTokenType): Promise<ActionTokenEntity[]> {
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    this.logger.verbose(`📂 Getting tokens for user "${userId}"`);
    try {
      // Get the tokens
      const tokens = await this.prisma.actionToken.findMany({
        where: { userId, type, expiresAt: { gte: new Date() } },
        orderBy: { createdAt: 'asc' },
      });
      this.logger.debug(`✅️ Found ${tokens.length} tokens for user "${userId}"`);
      // Return the tokens
      return tokens;
    } catch (error) {
      this.logger.error(`🚨 Failed to get tokens for user "${userId}"`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Create a token
   * @param data - The token data
   * @returns The created token
   */
  async createToken(data: CreateActionTokenDto): Promise<ActionTokenEntity> {
    this.logger.verbose(`📂 Creating ${data.type} token for user "${data.email}"`);
    try {
      // Create the token
      const token = await this.prisma.actionToken.create({
        data: {
          type: data.type,
          email: data.email,
          expiresAt: data.expiresAt,
          payload: data.payload || undefined,
          ...(data.userId && { user: { connect: { id: data.userId } } }),
          ...(data.campaignId && { campaign: { connect: { id: data.campaignId } } }),
        },
      });
      this.logger.debug(`✅️ Created token "${token.id}" for user "${data.email}"`);
      // Return the token
      return token;
    } catch (error) {
      this.logger.error(`🚨 Failed to create token for user "${data.email}"`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Update a token
   * @param id - The token id
   * @param data - The token data
   * @returns The updated token
   */
  async updateToken(id: string, data: Prisma.ActionTokenUpdateInput): Promise<ActionTokenEntity> {
    this.logger.verbose(`📂 Updating token "${id}"`);
    try {
      // Update the token
      const token = await this.prisma.actionToken.update({ where: { id }, data });
      this.logger.debug(`✅️ Updated token "${id}"`);
      // Return the token
      return token;
    } catch (error) {
      this.logger.error(`🚨 ActionToken "${id}" not found`, error);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete a token
   * @param id - The token id
   * @returns The deleted token
   */
  async deleteToken(id: string): Promise<ActionTokenEntity> {
    this.logger.verbose(`📂 Deleting token "${id}"`);
    try {
      // Delete the token
      const token = await this.prisma.actionToken.delete({ where: { id } });
      this.logger.debug(`✅️ Deleted token "${id}"`);
      // Return the token
      return token;
    } catch (error) {
      this.logger.error(`🚨 ActionToken "${id}" not found`, error);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Assign tokens matching an email to a user
   * @param email - The user's email
   * @param userId - The user's id
   * @returns The updated tokens
   */
  async assignTokensToUser(email: string, userId: string): Promise<ActionTokenEntity[]> {
    this.logger.verbose(`📂 Assigning tokens of email "${email}" to user "${userId}"`);
    try {
      // Update the tokens
      const tokens = await this.prisma.actionToken.updateMany({
        where: { email },
        data: { userId },
      });
      this.logger.debug(`✅️ Assigned ${tokens.count} tokens of email "${email}" to user "${userId}"`);
      // Return the tokens
      const updatedTokens = await this.prisma.actionToken.findMany({ where: { email } });
      return updatedTokens;
    } catch (error) {
      this.logger.error(`🚨 Failed to assign tokens of email "${email}" to user "${userId}"`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Sign a JWT for a user and return it
   * @param userId - The user's ID
   * @returns The JWT
   */
  generateToken(userId: string): string {
    this.logger.verbose(`📂 Generating token`);
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: config.JWT_SECRET,
      expiresIn: config.JWT_EXPIRES_IN,
    });
    this.logger.debug(`✅️ Generated token`);
    return token;
  }

  /**
   * Verify a JWT and return the payload
   * @param token - The JWT
   * @returns The token payload
   */
  verifyToken(token: string): TokenPayload {
    this.logger.verbose(`📂 Verifying token`);
    const payload = this.jwtService.verify(token, { secret: config.JWT_SECRET });
    this.logger.debug(`✅️ Verified token`);
    return payload;
  }

  /**
   * Delete expired tokens from the database every day at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens(): Promise<void> {
    this.logger.verbose(`📂 Deleting expired tokens`);
    await this.prisma.actionToken.deleteMany({ where: { expiresAt: { lte: new Date() } } });
    this.logger.debug(`✅️ Deleted expired tokens`);
  }
}
