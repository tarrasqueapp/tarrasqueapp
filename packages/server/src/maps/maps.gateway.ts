import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { config } from '../config';

@WebSocketGateway({ path: `${config.BASE_PATH}/socket.io`, cors: { origin: '*' } })
export class MapsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MapsGateway');

  @SubscribeMessage('joinMap')
  handleJoinMap(client: Socket, mapId: string) {
    client.join(mapId);
    this.logger.verbose(`Client "${client.id}" joined map "${mapId}"`);
  }

  afterInit() {
    this.logger.verbose('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.verbose(`Client disconnected: "${client.id}"`);
  }

  handleConnection(client: Socket) {
    this.logger.verbose(`Client connected: "${client.id}"`);
  }
}
