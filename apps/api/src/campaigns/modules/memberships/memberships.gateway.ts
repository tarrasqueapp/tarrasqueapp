import { Logger, UseGuards } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { TarrasqueEvent } from '@tarrasque/sdk';

import { JwtWsAuthGuard } from '../../../auth/guards/jwt-ws-auth.guard';
import { MembershipEntity } from './entities/membership.entity';

@UseGuards(JwtWsAuthGuard)
@WebSocketGateway({ path: '/socket.io', cors: { origin: '*' } })
export class MembershipsGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(MembershipsGateway.name);

  /**
   * Create a membership in the client
   * @param membership - The membership to send to the client
   */
  @SubscribeMessage(TarrasqueEvent.MEMBERSHIP_CREATED)
  createMembership(@MessageBody() membership: MembershipEntity) {
    // Emit the new membership to the campaign's room
    this.server.to(`campaign/${membership.campaignId}`).emit(TarrasqueEvent.MEMBERSHIP_CREATED, membership);
    // Get the clients in the added user's room
    const clients = this.server.sockets.adapter.rooms.get(`user/${membership.userId}`);
    // If there are clients in the added user's room, have them join the campaign's room
    if (clients) {
      clients.forEach((client) => {
        this.server.sockets.sockets.get(client).join(`campaign/${membership.campaignId}`);
      });
    }
    this.logger.debug(`🚀 Membership of user "${membership.userId}" created in campaign "${membership.campaignId}"`);
  }

  /**
   * Update a membership in the client
   * @param membership - The membership to update in the client
   */
  @SubscribeMessage(TarrasqueEvent.MEMBERSHIP_UPDATED)
  updateMembership(@MessageBody() membership: MembershipEntity) {
    // Emit the updated membership to the campaign's room
    this.server.to(`campaign/${membership.campaignId}`).emit(TarrasqueEvent.MEMBERSHIP_UPDATED, membership);
    this.logger.debug(`🚀 Membership of user "${membership.userId}" updated in campaign "${membership.campaignId}"`);
  }

  /**
   * Delete a membership from the client
   * @param membership - The membership to delete from the client
   */
  @SubscribeMessage(TarrasqueEvent.MEMBERSHIP_DELETED)
  deleteMembership(@MessageBody() membership: MembershipEntity) {
    // Emit the deleted membership to the campaign's room
    this.server.to(`campaign/${membership.campaignId}`).emit(TarrasqueEvent.MEMBERSHIP_DELETED, membership);
    this.logger.debug(`🚀 Membership of user "${membership.userId}" deleted from campaign "${membership.campaignId}"`);
  }
}
