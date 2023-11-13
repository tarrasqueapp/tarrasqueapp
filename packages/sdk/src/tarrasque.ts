import { Socket, io } from 'socket.io-client';

import { TarrasqueEmitEvents, TarrasqueListenEvents } from './events';

type CustomSocket = Socket<TarrasqueListenEvents, TarrasqueEmitEvents>;

// The config that the Tarrasque SDK can be initialized with
interface TarrasqueProps {
  url?: string;
}

class Tarrasque implements TarrasqueProps {
  // The URL of the Tarrasque App server
  public url = 'https://tarrasque.app';

  // Socket.io client
  private socket: CustomSocket;
  public on: CustomSocket['on'];
  public emit: CustomSocket['emit'];

  /**
   * Initialize the Tarrasque SDK with an optional config.
   * @param config - The config to use
   */
  constructor(config?: TarrasqueProps) {
    // Merge the config with the default config
    Object.assign(this, config);

    // Disconnect from the Tarrasque server if already connected
    this.disconnect();

    // Initialize the socket.io client
    this.socket = io(this.url);

    // Attach the socket.io client's on and emit methods to the instance
    this.on = this.socket.on.bind(this.socket);
    this.emit = this.socket.emit.bind(this.socket);
  }

  /**
   * Disconnect from the Tarrasque server.
   */
  disconnect() {
    this.socket?.disconnect();
  }

  /**
   * Re-initialize the Tarrasque SDK with a new config.
   * @param config - The new config to use
   */
  init(config?: TarrasqueProps) {
    tarrasque = new Tarrasque(config);
  }
}

// Export the Tarrasque SDK instance
export let tarrasque = new Tarrasque();
