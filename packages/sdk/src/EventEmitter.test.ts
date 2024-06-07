import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EventEmitter } from './EventEmitter';
import { TarrasqueSDKConfig } from './TarrasqueSDK';

vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

describe('EventEmitter', () => {
  let eventEmitter: EventEmitter;
  const mockConfig: TarrasqueSDKConfig = { mode: 'plugin' };

  beforeEach(() => {
    eventEmitter = new EventEmitter(mockConfig);
  });

  afterEach(() => {
    eventEmitter.destroy();
    vi.clearAllMocks();
  });

  it('should register an event listener with on', () => {
    const listener = vi.fn();
    eventEmitter.on('CAMERA_MOVED', listener);
    eventEmitter.emit('CAMERA_MOVED', { x: 0, y: 0 });
    expect(listener).toHaveBeenCalledWith([{ x: 0, y: 0 }]);
  });

  it('should unregister an event listener with off', () => {
    const listener = vi.fn();
    eventEmitter.on('CAMERA_MOVED', listener);
    eventEmitter.off('CAMERA_MOVED', listener);
    eventEmitter.emit('CAMERA_MOVED', { x: 0, y: 0 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('should register an event listener with once', () => {
    const listener = vi.fn();
    eventEmitter.once('LOADED', listener);
    eventEmitter.emit('LOADED');
    eventEmitter.emit('LOADED');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should emit an event and wait for response', async () => {
    const listener = vi.fn().mockResolvedValue('hex');
    eventEmitter.on('GET_GRID_TYPE', listener);

    const result = await eventEmitter.emit('GET_GRID_TYPE');
    expect(result).toEqual('hex');
    expect(listener).toHaveBeenCalledWith([]);
  });

  it('should handle emit timeout', async () => {
    eventEmitter.on('GET_GRID_TYPE', () => new Promise(() => {}));
    await expect(eventEmitter.emit('GET_GRID_TYPE')).rejects.toThrow('Timeout waiting for response to GET_GRID_TYPE');
  });

  it('should clean up resources on destroy', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    eventEmitter.destroy();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    expect(eventEmitter['emitter'].listenerCount()).toBe(0);
  });
});

// let emitter: EventEmitter;

// beforeEach(() => {
//   emitter = new EventEmitter({ mode: 'app' });
// });

// afterEach(() => {
//   emitter.destroy();
// });

// test('listens for an event and runs a callback only once when it is received', async () => {
//   // Listen for the event
//   const callback = vi.fn((data: { payload: unknown; uuid: string }) => {
//     emitter.emit(`LOADED/RESPONSE_${data.uuid}`, []);
//   });
//   emitter.once('LOADED', callback);

//   // Emit the event twice
//   await emitter.emit('LOADED');
//   await emitter.emit('LOADED');

//   // Expect the callback to be called only once
//   expect(callback).toHaveBeenCalledTimes(1);
// });

// test('listens for an event and runs a callback every time it is received', async () => {
//   // Listen for the event
//   const callback = vi.fn();
//   emitter.on('SET_CAMERA_COORDINATES', callback);

//   // Emit the event and expect the callback to be called with the payload
//   await emitter.emit('SET_CAMERA_COORDINATES', { x: 0, y: 0 });
//   expect(callback).toHaveBeenCalledWith({ x: 0, y: 0 });

//   // Emit the event again and expect the callback to be called with the new payload
//   await emitter.emit('SET_CAMERA_COORDINATES', { x: 1, y: 1 });
//   expect(callback).toHaveBeenCalledWith({ x: 1, y: 1 });

//   // Expect the callback to have been called twice
//   expect(callback).toHaveBeenCalledTimes(2);
// });

// test('stops listening for an event', async () => {
//   // Listen for the event
//   const callback = vi.fn();
//   emitter.on('CAMERA_MOVED', callback);

//   // Emit the event and expect the callback to be called with the payload
//   await emitter.emit('CAMERA_MOVED', { x: 0, y: 0 });
//   expect(callback).toHaveBeenCalledWith({ x: 0, y: 0 });

//   // Stop listening for the event
//   emitter.off('CAMERA_MOVED', callback);

//   // Emit the event again and expect the callback to have not been called again
//   await emitter.emit('CAMERA_MOVED', { x: 1, y: 1 });
//   expect(callback).toHaveBeenCalledTimes(1);
//   expect(callback).toHaveBeenCalledWith({ x: 0, y: 0 });
// });

// test('emits an event to the local listeners', async () => {
//   // Listen for the event
//   const callback = vi.fn();
//   emitter.on('LOADED', callback);

//   // Emit the event and expect the callback to be called
//   await emitter.emit('LOADED');
//   expect(callback).toHaveBeenCalled();
// });

// test('emits an event to the child iframes', async () => {
//   // Create a child iframe
//   document.appendChild(document.createElement('iframe'));
//   const iframe = document.querySelector('iframe');

//   // Mock the postMessage function on the iframe
//   iframe!.contentWindow!.postMessage = vi.fn<any>();

//   // Emit the event and expect the postMessage function to be called
//   await emitter.emit('LOADED');
//   expect(iframe!.contentWindow!.postMessage).toHaveBeenCalledWith({ event: 'LOADED', data: undefined }, '*');
// });

// test('emits an event to the parent window when in plugin mode', async () => {
//   // Change the mode to plugin
//   emitter = new EventEmitter({ mode: 'plugin' });

//   // Mock the postMessage function on the parent window
//   window.parent.postMessage = vi.fn<any>();

//   // Emit the event and expect the postMessage function to be called
//   await emitter.emit('LOADED');
//   expect(window.parent.postMessage).toHaveBeenCalledWith({ event: 'LOADED', data: undefined }, '*');
// });
