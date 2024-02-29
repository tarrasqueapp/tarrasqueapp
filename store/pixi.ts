import { Viewport } from 'pixi-viewport';
import { create } from 'zustand';

import { Map } from '@/actions/maps';

export interface PositionEntity {
  x: number;
  y: number;
  scale: number;
}

interface PixiStore {
  map: Map | null;
  setMap: (map: Map) => void;
  viewport: Viewport | null;
  setViewport: (viewport: Viewport) => void;
  positions: Record<string, PositionEntity>;
  getPosition: (mapId: string) => PositionEntity | null;
  setPosition: (mapId: string, position: PositionEntity) => void;
}

export const usePixiStore = create<PixiStore>((set, get) => ({
  map: null,
  viewport: null,
  positions: {},

  /**
   * Set the map
   * @param map - The map
   */
  setMap: (map) => set(() => ({ map })),

  /**
   * Set pixi-viewport instance.
   * @param viewport - The pixi-viewport instance
   */
  setViewport: (viewport) => set(() => ({ viewport })),

  /**
   * Get the camera position from local storage
   * @param mapId - The map ID
   * @returns The camera position
   */
  getPosition: (mapId) => {
    const positionFromState = get().positions[mapId];
    if (positionFromState) {
      return positionFromState;
    }

    const positionFromLocalStorage = localStorage.getItem(`map-position/${mapId}`);
    if (!positionFromLocalStorage) {
      return null;
    }

    const position = JSON.parse(positionFromLocalStorage);
    set((state) => ({ positions: { ...state.positions, [mapId]: position } }));
    return position;
  },

  /**
   * Set the camera position and update the local storage
   * @param mapId - The map ID
   * @param position - The camera position
   */
  setPosition: (mapId, position) => {
    localStorage.setItem(`map-position/${mapId}`, JSON.stringify(position));
    set((state) => ({ positions: { ...state.positions, [mapId]: position } }));
  },
}));
