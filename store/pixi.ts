import { Viewport } from 'pixi-viewport';
import { create } from 'zustand';

interface PixiStore {
  viewport: Viewport | null;
  setViewport: (viewport: Viewport) => void;
}

export const usePixiStore = create<PixiStore>((set) => ({
  viewport: null,

  /**
   * Set pixi-viewport instance.
   * @param viewport - The pixi-viewport instance
   */
  setViewport: (viewport) => set(() => ({ viewport })),
}));
