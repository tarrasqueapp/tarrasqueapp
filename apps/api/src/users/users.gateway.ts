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
  joinUserRoom(@ConnectedSocket() client: Socket, @UserWs() user: UserEntity) {
    if (!user) return;
    // Only allow a user to join their own room once
    if (client.rooms.has(`user/${user.id}`)) return;
    // Instruct the current client to join the user's room
    client.join(`user/${user.id}`);
    this.logger.debug(`🚀 User "${user.id}" joined`);
  }

  /**
   * Leave a user's room and all other rooms
   * @param client - The client that left the user's room
   * @param userId - The user's ID
   */
  @SubscribeMessage(SocketEvent.LEAVE_USER_ROOM)
  leaveUserRoom(@ConnectedSocket() client: Socket, @UserWs() user: UserEntity) {
    // Leave all rooms
    client.rooms.forEach((room) => client.leave(room));
    this.logger.debug(`🚀 User "${user.id}" left`);
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
    // Instruct the user's active clients to leave the user's room
    this.server.to(`user/${user.id}`).socketsLeave(`user/${user.id}`);
  }
}
