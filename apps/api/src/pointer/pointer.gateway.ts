import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class PointerGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(PointerGateway.name);

  @SubscribeMessage('pingLocation')
  handleMessage(client: Socket, data: { mapId: string; x: number; y: number }) {
    this.server.to(data.mapId).emit('pingLocation', data);
    this.logger.verbose(`Client "${client.id}" pinged location "x: ${data.x}, y: ${data.y}" on map "${data.mapId}"`);
  }
}
