import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ActionTokenType } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { ActionTokenEntity } from '../action-tokens/entities/action-token.entity';

@Injectable()
export class NotificationsService {
  private logger: Logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get a user's campaign invites
   * @param userId - The user's id
   * @returns User campaign invites
   */
  async getUserInvites(userId: string): Promise<ActionTokenEntity[]> {
    this.logger.verbose(`📂 Getting user "${userId}" invites`);
    try {
      // Get the invites
      const invites = await this.prisma.actionToken.findMany({
        where: { userId, type: ActionTokenType.INVITE },
        include: { campaign: true },
        orderBy: { createdAt: 'desc' },
      });
      this.logger.debug(`✅️ Found user "${userId}" invites`);
      return invites;
    } catch (error) {
      this.logger.error(`🚨 Failed to get user "${userId}" invites`, error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
