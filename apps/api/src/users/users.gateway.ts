import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { SocketEvent } from '@tarrasque/common';

import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { UserWs } from './decorators/user-ws.decorator';
import { UserEntity } from './entities/user.entity';

@UseGuards(JwtWsAuthGuard)
@WebSocketGateway({ path: '/socket.io', cors: { origin: '*' } })
export class UsersGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger(UsersGateway.name);

  /**
   * Join a user's room
   * @param client - The client that joined the user's room
   * @param userId - The user's ID
   * @param user - The user that joined the user's room
   */
  @SubscribeMessage(SocketEvent.JOIN_USER_ROOM)
  joinUserRoom(@ConnectedSocket() client: Socket, @MessageBody() userId: string, @UserWs() user: UserEntity) {
    // Only allow a user to join their own room
    if (userId !== user.id) return;
    // Only allow a user to join their own room once
    if (client.rooms.has(`user/${userId}`)) return;
    // Instruct the current client to join the user's room
    client.join(`user/${userId}`);
    this.logger.debug(`🚀 User "${userId}" joined`);
  }

  /**
   * Update a user in the client
   * @param user - The user to update in the client
   */
  @SubscribeMessage(SocketEvent.USER_UPDATED)
  updateUser(@MessageBody() user: UserEntity) {
    // Emit the updated user to the user's room
    this.server.to(`user/${user.id}`).emit(SocketEvent.USER_UPDATED, user);
    this.logger.debug(`🚀 User "${user.name}" updated`);
  }

  /**
   * Delete a user from the client
   * @param user - The user to delete from the client
   */
  @SubscribeMessage(SocketEvent.USER_DELETED)
  deleteUser(@MessageBody() user: UserEntity) {
    // Emit the deleted user to the user's room
    this.server.to(`user/${user.id}`).emit(SocketEvent.USER_DELETED, user);
    this.logger.debug(`🚀 User "${user.name}" deleted`);
  }
}
