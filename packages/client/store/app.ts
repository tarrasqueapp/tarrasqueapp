import { makeAutoObservable } from 'mobx';
import { Socket } from 'socket.io-client';

class AppStore {
  socket = null as unknown as Socket;
  isTrackpad = false;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Set Socket.IO client.
   * @param socket - The Socket.IO client
   */
  setSocket(socket: Socket) {
    this.socket = socket;
  }

  /**
   * Set trackpad or mouse mode.
   * @param isTrackpad - If the device is a trackpad
   */
  setIsTrackpad(isTrackpad: boolean) {
    if (this.isTrackpad === isTrackpad) return;
    this.isTrackpad = isTrackpad;
  }
}

export const appStore = new AppStore();
