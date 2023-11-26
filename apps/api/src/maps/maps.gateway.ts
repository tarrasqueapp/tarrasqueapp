import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { createId } from '@paralleldrive/cuid2';
import { Server, Socket } from 'socket.io';

import { PingLocationEntity, SocketEvent } from '@tarrasque/common';

import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { CampaignsService } from '../campaigns/campaigns.service';
import { UserWs } from '../users/decorators/user-ws.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { MapEntity } from './entities/map.entity';
import { MapsService } from './maps.service';

@UseGuards(JwtWsAuthGuard)
@WebSocketGateway({ path: '/socket.io', cors: { origin: '*' } })
export class MapsGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger(MapsGateway.name);

  constructor(
    private mapsService: MapsService,
    private campaignsService: CampaignsService,
  ) {}

  /**
   * Join a map's room
   * @param client - The client that joined the map's room
   * @param mapId - The map's ID
   * @param user - The user that joined the map's room
   */
  @SubscribeMessage(SocketEvent.JOIN_MAP_ROOM)
  async joinMapRoom(@ConnectedSocket() client: Socket, @MessageBody() mapId: string, @UserWs() user: UserEntity) {
    // Only allow a user to join a map's room if they are a member of a campaign that contains the map
    const map = await this.mapsService.getMapById(mapId);
    const campaign = await this.campaignsService.getCampaignById(map.campaignId);
    const membership = user.memberships.find((membership) => membership.campaignId === campaign.id);
    if (!membership) return;

    // Only allow a user to join a map's room once
    if (client.rooms.has(`map/${mapId}`)) return;

    // Instruct the current client to join the map's room
    client.join(`map/${mapId}`);
    this.logger.debug(`🚀 Map "${mapId}" joined by "${user.id}"`);
  }

  /**
   * Ping a location in the client
   * @param map - The map to ping a location in the client
   */
  @SubscribeMessage(SocketEvent.PING_LOCATION)
  pingLocation(@MessageBody() data: PingLocationEntity) {
    // Generate a unique ID for the ping
    const id = createId();

    // Emit the pinged location to the map's room
    this.server.to(`map/${data.mapId}`).emit(SocketEvent.PINGED_LOCATION, { id, ...data });
    this.logger.debug(`🚀 Map "${data.mapId}" pinged`);
  }

  /**
   * Create a map in the client
   * @param map - The map to create in the client
   * @param user - The user that created the map
   */
  // @SubscribeMessage(SocketEvent.MAP_CREATED)
  // async createMap(@MessageBody() map: MapEntity, @UserWs() user: UserEntity) {
  //   // Instruct the user's active clients to join the map's room
  //   this.server.to(`user/${user.id}`).socketsJoin(`map/${map.id}`);
  //   // Emit the new map to the map's room
  //   this.server.to(`map/${map.id}`).emit(SocketEvent.MAP_CREATED, map);
  //   this.logger.debug(`🚀 Map "${map.name}" created`);
  // }

  /**
   * Update a map in the client
   * @param map - The map to update in the client
   */
  @SubscribeMessage(SocketEvent.MAP_UPDATED)
  updateMap(@MessageBody() map: MapEntity) {
    // Emit the updated map to the map's room
    this.server.to(`map/${map.id}`).emit(SocketEvent.MAP_UPDATED, map);
    this.logger.debug(`🚀 Map "${map.name}" updated`);
  }

  /**
   * Delete a map from the client
   * @param map - The map to delete from the client
   */
  @SubscribeMessage(SocketEvent.MAP_DELETED)
  deleteMap(@MessageBody() map: MapEntity) {
    // Emit the deleted map to the map's room
    this.server.to(`map/${map.id}`).emit(SocketEvent.MAP_DELETED, map);
    this.logger.debug(`🚀 Map "${map.name}" deleted`);
  }
}
