import { makeAutoObservable } from 'mobx';
import { Viewport } from 'pixi-viewport';
import { Socket } from 'socket.io-client';

class AppStore {
  socket = null as unknown as Socket;
  viewport = null as unknown as Viewport;
  isTrackpad = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSocket(socket: Socket) {
    this.socket = socket;
  }

  setViewport(viewport: Viewport) {
    this.viewport = viewport;
  }

  setIsTrackpad(isTrackpad: boolean) {
    if (this.isTrackpad === isTrackpad) return;
    this.isTrackpad = isTrackpad;
  }
}

export const appStore = new AppStore();
