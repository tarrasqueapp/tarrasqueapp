import { Logger, UseGuards } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { SocketEvent } from '@tarrasque/common';

import { JwtWsAuthGuard } from '../../../auth/guards/jwt-ws-auth.guard';
import { PluginEntity } from './entities/plugin.entity';

@UseGuards(JwtWsAuthGuard)
@WebSocketGateway({ path: '/socket.io', cors: { origin: '*' } })
export class PluginsGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger(PluginsGateway.name);

  /**
   * Create a plugin in the client
   * @param plugin - The plugin to send to the client
   */
  @SubscribeMessage(SocketEvent.PLUGIN_INSTALLED)
  installPlugin(@MessageBody() plugin: PluginEntity) {
    // Emit the installed plugin to the campaign's room
    this.server.to(`campaign/${plugin.campaignId}`).emit(SocketEvent.PLUGIN_INSTALLED, plugin);
    this.logger.debug(`🚀 Plugin "${plugin.id}" installed in campaign "${plugin.campaignId}"`);
  }

  /**
   * Delete a plugin from the client
   * @param plugin - The plugin to delete from the client
   */
  @SubscribeMessage(SocketEvent.PLUGIN_UNINSTALLED)
  uninstallPlugin(@MessageBody() plugin: PluginEntity) {
    // Emit the uninstalled plugin to the campaign's room
    this.server.to(`campaign/${plugin.campaignId}`).emit(SocketEvent.PLUGIN_UNINSTALLED, plugin);
    this.logger.debug(`🚀 Plugin "${plugin.id}" uninstalled from campaign "${plugin.campaignId}"`);
  }
}
