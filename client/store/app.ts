import { makeAutoObservable } from 'mobx';
import { Viewport } from 'pixi-viewport';
import { Socket } from 'socket.io-client';

class AppStore {
  socket = null as unknown as Socket;
  viewport = null as unknown as Viewport;

  constructor() {
    makeAutoObservable(this);
  }

  setSocket(socket: Socket) {
    this.socket = socket;
  }

  setViewport(viewport: Viewport) {
    this.viewport = viewport;
  }
}

export const appStore = new AppStore();
