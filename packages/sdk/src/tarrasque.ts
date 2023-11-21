import { match } from 'path-to-regexp';
import { Socket, io } from 'socket.io-client';

import { TarrasqueEmitEvents, TarrasqueListenEvents } from './events';
import { CampaignEntity, MapEntity, UserEntity } from './types';

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
  public get<T>(key: string[]): T | undefined {
    return window.__REACT_QUERY_CLIENT__.getQueryData<T>(key);
  }

  // Cached data getters
  public data = {
    /**
     * Get the current user
     * @returns The user object
     */
    get user(): UserEntity | undefined {
      // Get the user object from the cache
      return tarrasque.get<UserEntity>(['user']);
    },

    /**
     * Get the current map
     * @returns The map object
     */
    get map(): MapEntity | undefined {
      // Get the path params from the current URL
      const fn = match<{ mapId: string }>('/map/:mapId', { decode: decodeURIComponent });
      const data = fn(window.location.pathname);

      // If not on a map, return undefined
      if (!data) return undefined;

      // Get the current map ID from the params
      const mapId = data.params.mapId;

      // Get the map object from the cache
      return mapId ? tarrasque.get<MapEntity>(['maps', mapId]) : undefined;
    },

    /**
     * Get the current campaign
     * @returns The campaign object
     */
    get campaign(): CampaignEntity | undefined {
      // Get the current map object
      const map = this.map;

      // If not on a map, return undefined
      if (!map) return undefined;

      // Get the current campaign ID from the map
      const campaignId = map.campaignId;

      // Get the campaign object from the cache
      return campaignId ? tarrasque.get<CampaignEntity>(['campaigns', campaignId]) : undefined;
    },
  };
}

// Export the Tarrasque SDK instance
export const tarrasque = new Tarrasque();
