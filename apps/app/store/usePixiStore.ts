import { Viewport } from '@tarrasque/pixi-viewport';
import { create } from 'zustand';

export interface PositionEntity {
  x: number;
  y: number;
  scale: number;
}

interface PixiStore {
  mapId: string | null;
  setMapId: (mapId: string) => void;
  viewport: Viewport | null;
  setViewport: (viewport: Viewport) => void;
  positions: Record<string, PositionEntity>;
  getPosition: (mapId: string) => PositionEntity | null;
  setPosition: (mapId: string, position: PositionEntity) => void;
  aligningGrid: boolean;
  setAligningGrid: (aligningGrid: boolean) => void;
}

export const usePixiStore = create<PixiStore>((set, get) => ({
  mapId: null,
  viewport: null,
  positions: {},
  aligningGrid: false,

  /**
   * Set the map ID
   * @param mapId - The map ID
   */
  setMapId: (mapId) => set(() => ({ mapId })),

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

  /**
   * Set the aligningGrid state
   * @param aligningGrid - The aligningGrid state
   */
  setAligningGrid: (aligningGrid) => set(() => ({ aligningGrid })),
}));
