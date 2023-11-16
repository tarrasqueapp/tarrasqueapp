import { makeAutoObservable } from 'mobx';

class AppStore {
  isTrackpad = false;

  constructor() {
    makeAutoObservable(this);
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
