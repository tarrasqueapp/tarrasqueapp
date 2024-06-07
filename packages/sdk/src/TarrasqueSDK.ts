import { EventEmitter } from './EventEmitter';
import { CameraApi } from './api/CameraApi';
import { GridApi } from './api/GridApi';
import { ToolApi } from './api/ToolApi';

export interface TarrasqueSDKConfig {
  // Whether the SDK is running in an app or a plugin
  mode?: 'app' | 'plugin';
}

export class TarrasqueSDK {
  // Configuration options for Tarrasque SDK
  private config: TarrasqueSDKConfig;

  // Emittery instance for managing event listeners and emitting events locally
  emitter: EventEmitter;

  // API namespaces
  grid: GridApi;
  camera: CameraApi;
  tool: ToolApi;

  /**
   * Create a new Tarrasque SDK instance
   * @param config - Configuration options for the SDK
   */
  constructor(config: TarrasqueSDKConfig = { mode: 'plugin' }) {
    this.config = config;
    this.emitter = new EventEmitter(this.config);

    this.grid = new GridApi(this.emitter);
    this.camera = new CameraApi(this.emitter);
    this.tool = new ToolApi(this.emitter);
  }

  /**
   * Clean up resources by removing the message event listener and clearing internal listeners.
   */
  destroy() {
    this.emitter.destroy();
  }
}
