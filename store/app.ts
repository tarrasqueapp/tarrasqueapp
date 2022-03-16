import { makeAutoObservable } from 'mobx';
import { Viewport } from 'pixi-viewport';

class AppStore {
  viewport = null as unknown as Viewport;

  constructor() {
    makeAutoObservable(this);
  }

  setViewport(viewport: Viewport) {
    this.viewport = viewport;
  }
}

export const appStore = new AppStore();
