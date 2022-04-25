import { makeAutoObservable } from 'mobx';
import { Socket } from 'socket.io-client';

class AppStore {
  socket = null as unknown as Socket;
  isTrackpad = false;
  fullScreen = false;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Set Socket.IO client.
   * @param socket
   */
  setSocket(socket: Socket) {
    this.socket = socket;
  }

  /**
   * Set trackpad or mouse mode.
   * @param isTrackpad
   */
  setIsTrackpad(isTrackpad: boolean) {
    if (this.isTrackpad === isTrackpad) return;
    this.isTrackpad = isTrackpad;
  }

  /**
   * Toggle full screen mode.
   */
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      this.fullScreen = true;
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        this.fullScreen = false;
        document.exitFullscreen();
      }
    }
  }
}

export const appStore = new AppStore();
