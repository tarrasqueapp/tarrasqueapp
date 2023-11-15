import { Logger, UseGuards } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { TarrasqueEvent } from '@tarrasque/sdk';

import { ActionTokenEntity } from '../../../action-tokens/entities/action-token.entity';
import { JwtWsAuthGuard } from '../../../auth/guards/jwt-ws-auth.guard';

@UseGuards(JwtWsAuthGuard)
@WebSocketGateway({ path: '/socket.io', cors: { origin: '*' } })
export class InvitesGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(InvitesGateway.name);

  /**
   * Create a invite in the client
   * @param invite - The invite to send to the client
   */
  @SubscribeMessage(TarrasqueEvent.INVITE_CREATED)
  createInvite(@MessageBody() invite: ActionTokenEntity) {
    // Emit the new invite to the campaign's room
    this.server.to(`campaign/${invite.campaignId}`).emit(TarrasqueEvent.INVITE_CREATED, invite);
    this.logger.debug(`🚀 Invite for user "${invite.email}" created in campaign "${invite.campaignId}"`);
  }

  /**
   * Update a invite in the client
   * @param invite - The invite to update in the client
   */
  @SubscribeMessage(TarrasqueEvent.INVITE_UPDATED)
  updateInvite(@MessageBody() invite: ActionTokenEntity) {
    // Emit the updated invite to the campaign's room
    this.server.to(`campaign/${invite.campaignId}`).emit(TarrasqueEvent.INVITE_UPDATED, invite);
    this.logger.debug(`🚀 Invite for user "${invite.email}" updated in campaign "${invite.campaignId}"`);
  }

  /**
   * Delete a invite from the client
   * @param invite - The invite to delete from the client
   */
  @SubscribeMessage(TarrasqueEvent.INVITE_DELETED)
  deleteInvite(@MessageBody() invite: ActionTokenEntity) {
    // Emit the deleted invite to the campaign's room
    this.server.to(`campaign/${invite.campaignId}`).emit(TarrasqueEvent.INVITE_DELETED, invite);
    this.logger.debug(`🚀 Invite for user "${invite.email}" deleted from campaign "${invite.campaignId}"`);
  }
}
