import { Socket, io } from 'socket.io-client';

import { TarrasqueEmitEvents, TarrasqueListenEvents } from './events';
import { CampaignEntity, MapEntity } from './types';

type CustomSocket = Socket<TarrasqueListenEvents, TarrasqueEmitEvents>;

class Tarrasque {
  // Socket.io client
  private socket: CustomSocket;
  public on: CustomSocket['on'];
  public off: CustomSocket['off'];
  public emit: CustomSocket['emit'];

  constructor() {
    // Initialize the socket.io client
    this.socket = io({ path: '/socket.io', transports: ['websocket'], autoConnect: false });

    // Attach the socket.io client's on and emit methods to the instance
    this.on = this.socket.on.bind(this.socket);
    this.off = this.socket.off.bind(this.socket);
    this.emit = this.socket.emit.bind(this.socket);
  }

  /**
   * Connect to the Tarrasque server
   */
  public connect() {
    this.socket?.connect();
  }

  /**
   * Disconnect from the Tarrasque server
   */
  public disconnect() {
    this.socket?.disconnect();
  }

  /**
   * Get a cached value from the Tarrasque client
   * @param key - The key to get
   * @returns The value
   */
  public get<T>(key: string[]): T {
    return window.__REACT_QUERY_CLIENT__.getQueryData<T>(key);
  }

  public current = {
    /**
     * Get the current map ID
     * @returns The map ID
     */
    get mapId(): string {
      // Get the path segments from the URL
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      // Find the index of the map prefix segment
      const mapIndex = pathSegments.indexOf('map');

      // If the map prefix segment exists and there is another segment after it, that's the map ID
      if (mapIndex !== -1 && pathSegments.length > mapIndex + 1) {
        return pathSegments[mapIndex + 1];
      }

      return null;
    },

    /**
     * Get the current map
     * @returns The map object
     */
    get map(): MapEntity {
      console.log(tarrasque.get<MapEntity>(['maps', this.mapId]));
      return this.mapId ? tarrasque.get<MapEntity>(['maps', this.mapId]) : null;
    },

    /**
     * Get the current campaign ID
     * @returns The campaign ID
     */
    get campaignId(): string {
      // Get the current map object
      const map = this.map;

      // If the map exists, return the campaign ID
      return map?.campaignId;
    },

    /**
     * Get the current campaign
     * @returns The campaign object
     */
    get campaign(): CampaignEntity {
      return this.campaignId ? tarrasque.get<CampaignEntity>(['campaigns', this.campaignId]) : null;
    },
  };
}

// Export the Tarrasque SDK instance
export const tarrasque = new Tarrasque();
