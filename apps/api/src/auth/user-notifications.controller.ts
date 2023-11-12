import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ActionTokenType } from '@prisma/client';

import { ActionTokensService } from '../action-tokens/action-tokens.service';
import { ActionTokenEntity } from '../action-tokens/entities/action-token.entity';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth/notifications')
@Controller('auth/notifications')
export class UserNotificationsController {
  constructor(private readonly actionTokensService: ActionTokensService) {}

  /**
   * Get the user's notifications
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: null })
  async getNotifications(@User() user: UserEntity): Promise<{ campaignInvites: ActionTokenEntity[] }> {
    const campaignInvites = await this.actionTokensService.getTokensByUserId(user.id, ActionTokenType.INVITE);
    return { campaignInvites };
  }
}
