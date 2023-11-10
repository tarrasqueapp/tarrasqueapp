import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EventTokenType } from '@prisma/client';

import { EventTokenEntity } from '../event-tokens/entities/event-token.entity';
import { EventTokensService } from '../event-tokens/event-tokens.service';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth/notifications')
@Controller('auth/notifications')
export class UserNotificationsController {
  constructor(private readonly eventTokensService: EventTokensService) {}

  /**
   * Get the user's notifications
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: null })
  async getNotifications(@User() user: UserEntity): Promise<{ campaignInvites: EventTokenEntity[] }> {
    const campaignInvites = await this.eventTokensService.getTokensByUserId(user.id, EventTokenType.INVITE);
    return { campaignInvites };
  }
}
