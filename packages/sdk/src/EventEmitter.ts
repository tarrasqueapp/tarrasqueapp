import { logger } from '@tarrasque/common';
import Emittery, { UnsubscribeFunction } from 'emittery';
import { v4 as uuidv4 } from 'uuid';

import { TarrasqueSDKConfig } from './TarrasqueSDK';
import { MessageListener, MessageName, MessagePayload, MessageResponse } from './events';

export class EventEmitter {
  // Configuration options for Tarrasque SDK
  private config: TarrasqueSDKConfig;

  // Internal Emittery instance for managing event listeners and emitting events locally
  private emitter: Emittery;

  /**
   * Create a new Tarrasque SDK instance
   * @param config - Configuration options for the SDK
   */
  constructor(config: TarrasqueSDKConfig = { mode: 'plugin' }) {
    logger.debug('🔥 Creating Tarrasque SDK');

    this.config = config;
    this.emitter = new Emittery();

    // Listen for messages from the parent window
    if (this.config.mode === 'plugin') {
      window.addEventListener('message', this.handleMessage);
    }
  }

  /**
   * Clean up resources by removing the message event listener and clearing internal listeners.
   */
  destroy() {
    logger.debug('🔥 Destroying Tarrasque SDK');

    // Clear all listeners
    this.emitter.clearListeners();

    // Stop listening for messages from the parent window
    if (this.config.mode === 'plugin') {
      window.removeEventListener('message', this.handleMessage);
    }
  }

  /**
   * Handle incoming messages from the parent window
   * @param event - The message event containing data about the received message
   */
  private handleMessage(event: MessageEvent): void {
    const message = event.data;
    logger.debug('📥 Received message from app', message.event, message.payload ?? '');

    // Emit the message to the local listeners
    this.emitter.emit(message.event, message.payload);
  }

  /**
   * Post a message to all iframes on the page
   * @param event - The event to post to the iframes
   * @param payload - The payload to post with the event
   */
  private sendToPlugins(event: string, payload: unknown): void {
    logger.debug('📤 Sending message to plugins', event, payload ?? '');
    Array.from(document.querySelectorAll('iframe')).forEach((iframe) => {
      iframe.contentWindow?.postMessage({ event, payload }, '*');
    });
  }

  /**
   * Post a message to the parent window
   * @param event - The event to post to the parent window
   * @param payload - The payload to post with the event
   * @param uuid - A unique identifier for the message
   */
  private sendToApp(event: string, payload: unknown, uuid: string): void {
    logger.debug('📤 Sending message to app', event, payload ?? '');
    window.parent.postMessage({ event, payload, uuid }, '*');
  }

  /**
   * Listen for an event and run a callback when it is received
   * @param event - The event to listen for
   * @param listener - The callback to run when the event is received
   * @returns A function to stop listening for the event
   * @example
   * ```ts
   * tarrasque.on('CAMERA_MOVED', (data) => {
   *   console.log(data);
   * });
   * ```
   */
  on<T extends MessageName>(event: T, listener: MessageListener<T>): UnsubscribeFunction {
    logger.debug('👂 Listening for event', event);
    return this.emitter.on(event, listener);
  }

  /**
   * Stop listening for an event with a specific callback
   * @param event - The event to stop listening for
   * @param callback - The callback to stop running when the event is received
   * @example
   * ```ts
   * const callback = (data) => {
   *   console.log(data);
   * };
   * tarrasque.on('CAMERA_MOVED', callback);
   * tarrasque.off('CAMERA_MOVED', callback);
   * ```
   */
  off<T extends MessageName>(event: T, listener: MessageListener<T>): void {
    logger.debug('👂 Stopped listening for event', event);
    this.emitter.off(event, listener);
  }

  /**
   * Listen for an event and run a callback only once when it is received
   * @param event - The event to listen for
   * @param listener - The callback to run when the event is received
   * @example
   * ```ts
   * tarrasque.once('LOADED', (data) => {
   *   console.log(data);
   * });
   * ```
   */
  once<T extends MessageName>(event: T, listener: MessageListener<T>): void {
    logger.debug('👂 Listening once for event', event);
    this.emitter.once(event).then(listener);
  }

  /**
   * Emit an event to the local listeners and send the event to the parent window or child iframes depending on the mode
   * @param event - The event name to emit
   * @param payload - Optional payload to emit with the event
   * @example
   * ```ts
   * tarrasque.emit('ANIMATE_TO', { x: 0, y: 0 });
   * tarrasque.emit('ZOOM_IN');
   * const gridType = await tarrasque.emit('GET_GRID_TYPE');
   * ```
   */
  async emit<T extends MessageName>(event: T, ...payload: MessagePayload<T>): Promise<MessageResponse<T>> {
    logger.debug('📤 Sending message', event, payload ?? '');

    const uuid = uuidv4();

    // If in plugin mode, send the message to the parent window and request a response
    if (this.config.mode === 'plugin') {
      this.sendToApp(event, payload, uuid);
    }

    // If in app mode, send the message to the local listeners and request a response
    if (this.config.mode === 'app') {
      this.emitter.emit(event, payload);
    }

    // Create a promise that resolves when the response is received
    const response = await new Promise<MessageResponse<T>>((resolve, reject) => {
      const responseEvent = `${event}/RESPONSE_${uuid}`;

      logger.debug('⏳ Waiting for response', responseEvent);

      const timeout = setTimeout(() => {
        this.emitter.off(responseEvent, callback);
        reject(new Error(`Timeout waiting for response to ${event}`));
      }, 500);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const callback = (response: any) => {
        clearTimeout(timeout);
        this.emitter.off(responseEvent, callback);
        resolve(response);
      };

      this.emitter.on(responseEvent, callback);
    });

    // If in app mode, after receiving the response, send the message to the child iframes
    if (this.config.mode === 'app') {
      this.sendToPlugins(event, payload);
    }

    return response;
  }
}
