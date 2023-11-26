import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { SocketEvent } from '@tarrasque/common';

import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { UserWs } from '../users/decorators/user-ws.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CampaignEntity } from './entities/campaign.entity';

@UseGuards(JwtWsAuthGuard)
@WebSocketGateway({ path: '/socket.io', cors: { origin: '*' } })
export class CampaignsGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger(CampaignsGateway.name);

  /**
   * Join a campaign's room
   * @param client - The client that joined the campaign's room
   * @param campaignId - The campaign's ID
   * @param user - The user that joined the campaign's room
   */
  @SubscribeMessage(SocketEvent.JOIN_CAMPAIGN_ROOM)
  joinCampaignRoom(@ConnectedSocket() client: Socket, @MessageBody() campaignId: string, @UserWs() user: UserEntity) {
    // Only allow a user to join a campaign's room if they are a member of that campaign
    const membership = user.memberships.find((membership) => membership.campaignId === campaignId);
    if (!membership) return;
    // Only allow a user to join a campaign's room once
    if (client.rooms.has(`campaign/${campaignId}`)) return;
    // Instruct the current client to join the campaign's room
    client.join(`campaign/${campaignId}`);
    this.logger.debug(`🚀 Campaign "${campaignId}" joined by "${user.id}"`);
  }

  /**
   * Create a campaign in the client
   * @param campaign - The campaign to create in the client
   * @param user - The user that created the campaign
   */
  @SubscribeMessage(SocketEvent.CAMPAIGN_CREATED)
  async createCampaign(@MessageBody() campaign: CampaignEntity) {
    // Instruct the user's active clients to join the campaign's room
    this.server.to(`user/${campaign.createdById}`).socketsJoin(`campaign/${campaign.id}`);
    // Emit the new campaign to the campaign's room
    this.server.to(`campaign/${campaign.id}`).emit(SocketEvent.CAMPAIGN_CREATED, campaign);
    this.logger.debug(`🚀 Campaign "${campaign.name}" created`);
  }

  /**
   * Update a campaign in the client
   * @param campaign - The campaign to update in the client
   */
  @SubscribeMessage(SocketEvent.CAMPAIGN_UPDATED)
  updateCampaign(@MessageBody() campaign: CampaignEntity) {
    // Emit the updated campaign to the campaign's room
    this.server.to(`campaign/${campaign.id}`).emit(SocketEvent.CAMPAIGN_UPDATED, campaign);
    this.logger.debug(`🚀 Campaign "${campaign.name}" updated`);
  }

  /**
   * Delete a campaign from the client
   * @param campaign - The campaign to delete from the client
   */
  @SubscribeMessage(SocketEvent.CAMPAIGN_DELETED)
  deleteCampaign(@MessageBody() campaign: CampaignEntity) {
    // Emit the deleted campaign to the campaign's room
    this.server.to(`campaign/${campaign.id}`).emit(SocketEvent.CAMPAIGN_DELETED, campaign);
    this.logger.debug(`🚀 Campaign "${campaign.name}" deleted`);
  }

  /**
   * Reorder campaigns in the client
   * @param campaignIds - The new campaign order
   */
  @SubscribeMessage(SocketEvent.CAMPAIGNS_REORDERED)
  reorderCampaigns(@MessageBody() campaignIds: string[], @UserWs() user: UserEntity) {
    // Emit the new campaign order to the user's room
    this.server.to(`user/${user.id}`).emit(SocketEvent.CAMPAIGNS_REORDERED, campaignIds);
    this.logger.debug(`🚀 Campaigns for user ${user.id} reordered`);
  }
}
