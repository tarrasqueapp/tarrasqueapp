import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationTypeEnum } from './notification-type.enum';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  /**
   * Get the user's notifications
   * @param user - The user to get the notifications for
   * @returns The user's notifications
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiCookieAuth()
  @ApiOkResponse({ type: [NotificationEntity] })
  async getNotifications(@User() user: UserEntity): Promise<NotificationEntity[]> {
    // Get the user's invites
    const invites = await this.notificationsService.getUserInvites(user.id);

    // Convert the invites to invite notifications
    const inviteNotifications = invites.map((invite) => ({
      userId: invite.userId,
      type: NotificationTypeEnum.INVITE,
      data: invite,
    }));

    return [...inviteNotifications];
  }
}
