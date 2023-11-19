import { Logger, UseGuards } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { TarrasqueEvent } from '@tarrasque/sdk';

import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { NotificationEntity } from './entities/notification.entity';

@UseGuards(JwtWsAuthGuard)
@WebSocketGateway({ path: '/socket.io', cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger(NotificationsGateway.name);

  /**
   * Create a notification in the client
   * @param notification - The notification to send to the client
   */
  @SubscribeMessage(TarrasqueEvent.NOTIFICATION_CREATED)
  createNotification(@MessageBody() notification: NotificationEntity) {
    // Emit the new notification to the user's room
    this.server.to(`user/${notification.userId}`).emit(TarrasqueEvent.NOTIFICATION_CREATED, notification);
    this.logger.debug(`🚀 Notification for user "${notification.userId}" created`);
  }

  /**
   * Update a notification in the client
   * @param notification - The notification to update in the client
   */
  @SubscribeMessage(TarrasqueEvent.NOTIFICATION_UPDATED)
  updateNotification(@MessageBody() notification: NotificationEntity) {
    // Emit the updated notification to the user's room
    this.server.to(`user/${notification.userId}`).emit(TarrasqueEvent.NOTIFICATION_UPDATED, notification);
    this.logger.debug(`🚀 Notification for user "${notification.userId}" updated`);
  }

  /**
   * Delete a notification from the client
   * @param notification - The notification to delete from the client
   */
  @SubscribeMessage(TarrasqueEvent.NOTIFICATION_DELETED)
  deleteNotification(@MessageBody() notification: NotificationEntity) {
    // Emit the deleted notification to the user's room
    this.server.to(`user/${notification.userId}`).emit(TarrasqueEvent.NOTIFICATION_DELETED, notification);
    this.logger.debug(`🚀 Notification for user "${notification.userId}" deleted`);
  }
}
