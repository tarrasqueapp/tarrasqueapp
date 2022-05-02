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

@WebSocketGateway({ path: `${process.env.BASE_PATH}/socket.io`, cors: { origin: '*' } })
export class MapsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MapsGateway');

  @SubscribeMessage('joinMap')
  handleJoinMap(client: Socket, mapId: string) {
    client.join(mapId);
    this.logger.debug(`Client "${client.id}" joined map "${mapId}"`);
  }

  afterInit() {
    this.logger.debug('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: "${client.id}"`);
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: "${client.id}"`);
  }
}
