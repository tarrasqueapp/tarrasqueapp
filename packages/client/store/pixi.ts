import { makeAutoObservable } from 'mobx';
import { Viewport } from 'pixi-viewport';

class PixiStore {
  viewport = null as unknown as Viewport;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Set pixi-viewport instance.
   * @param viewport
   */
  setViewport(viewport: Viewport) {
    this.viewport = viewport;
  }
}

export const pixiStore = new PixiStore();
