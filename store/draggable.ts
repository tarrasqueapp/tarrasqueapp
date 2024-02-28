import { create } from 'zustand';

import { Coordinates, Dimensions } from '@/lib/types';

export enum AnchorPoint {
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  CENTER = 'CENTER',
}

export enum NativeDraggable {
  DICE_ROLLER = 'dice-roller',
}

interface Draggable {
  coordinates: Coordinates;
  dimensions: Dimensions;
  zIndex: number;
  visible: boolean;
}

interface DraggableStore {
  draggables: Record<string, Draggable>;
  createDraggable: (id: string, anchorPoint: AnchorPoint, initialDimensions: Dimensions) => void;
  updateCoordinates: (id: string, coordinates: Coordinates) => void;
  updateDimensions: (id: string, dimensions: Dimensions) => void;
  bringToFront: (id: string) => void;
  toggleVisibility: (id: string) => void;
  show: (id: string) => void;
  calculateInitialCoordinates: (anchorPoint: AnchorPoint, initialDimensions: Dimensions) => Coordinates;
  updateDraggable: (id: string, draggable: Partial<Draggable>) => void;
  getHighestZIndex: () => number;
  isDraggableObscured: (id: string) => boolean;
}

export const useDraggableStore = create<DraggableStore>((set, get) => ({
  draggables: {},

  /**
   * Create a draggable window
   * @param id - The id of the draggable window
   * @param anchorPoint - The initial position of the draggable window
   * @param initialDimensions - The dimensions of the draggable window
   * @returns The draggable window
   */
  createDraggable: (id, anchorPoint, initialDimensions) => {
    const initialCoordinates = get().calculateInitialCoordinates(anchorPoint, initialDimensions);
    const zIndex = get().getHighestZIndex() + 1;

    set((state) => ({
      ...state,
      draggables: {
        ...state.draggables,
        [id]: {
          coordinates: initialCoordinates,
          dimensions: initialDimensions,
          zIndex,
          visible: false,
        },
      },
    }));
  },

  /**
   * Update the coordinates of a draggable window
   * @param id - The id of the draggable window
   * @param coordinates - The coordinates of the draggable window
   * @returns The updated draggable window
   */
  updateCoordinates: (id, coordinates) => {
    get().updateDraggable(id, { coordinates });
  },

  /**
   * Update the dimensions of a draggable window
   * @param id - The id of the draggable window
   * @param dimensions - The dimensions of the draggable window
   * @returns The updated draggable window
   */
  updateDimensions: (id, dimensions) => {
    get().updateDraggable(id, { dimensions });
  },

  /**
   * Bring a draggable window to the front
   * @param id - The id of the draggable window
   * @returns The draggable window
   */
  bringToFront: (id) => {
    const draggables = get().draggables;
    const draggable = draggables[id];
    if (!draggable) return;

    // Check if the draggable window already has the highest z-index
    const highestZIndex = get().getHighestZIndex();
    if (draggable.zIndex === highestZIndex) return;

    // Increase the z-index of the draggable window to the next highest z-index
    const zIndex = highestZIndex + 1;
    get().updateDraggable(id, { zIndex });
  },

  /**
   * Toggle the visibility of a draggable window
   * @param id - The id of the draggable window
   * @returns The draggable window
   */
  toggleVisibility: (id) => {
    const draggables = get().draggables;
    const draggable = draggables[id];
    if (!draggable) return;

    if (!draggable.visible) {
      get().show(id);
      return;
    }

    const isObscured = get().isDraggableObscured(id);
    if (isObscured) {
      get().bringToFront(id);
      return;
    }

    get().updateDraggable(id, { visible: !draggable.visible });
  },

  /**
   * Show a draggable window
   * @param id - The id of the draggable window
   * @returns The draggable window
   */
  show: (id) => {
    const draggable = get().draggables[id];
    if (!draggable) return;

    // If the draggable window is already visible, bring it to the front
    get().bringToFront(id);

    if (draggable.visible) {
      return;
    }

    get().updateDraggable(id, { visible: true });
  },

  /**
   * Calculate the initial coordinates of a draggable window based on the anchor point and initial dimensions
   * @param anchorPoint - The anchor point of the draggable window
   * @param initialDimensions - The initial dimensions of the draggable window
   * @returns The initial coordinates of the draggable window
   */
  calculateInitialCoordinates(anchorPoint, initialDimensions) {
    if (typeof window === 'undefined') {
      return { x: 0, y: 0 };
    }

    const dockHeight = 67;
    const edgeOffset = 8;
    const { width, height } = initialDimensions;

    let x = 0;
    let y = 0;

    switch (anchorPoint) {
      case AnchorPoint.TOP_LEFT:
        x = edgeOffset;
        y = edgeOffset;
        break;
      case AnchorPoint.TOP_RIGHT:
        x = window.innerWidth - width - edgeOffset;
        y = edgeOffset;
        break;
      case AnchorPoint.BOTTOM_LEFT:
        x = edgeOffset;
        y = window.innerHeight - height - dockHeight - edgeOffset;
        break;
      case AnchorPoint.BOTTOM_RIGHT:
        x = window.innerWidth - width - edgeOffset;
        y = window.innerHeight - height - dockHeight - edgeOffset;
        break;
      case AnchorPoint.CENTER:
      default:
        x = window.innerWidth / 2 - width / 2;
        y = window.innerHeight / 2 - height / 2;
        break;
    }

    return { x, y };
  },

  /**
   * Helper function to update a draggable window in the store
   * @param id - The id of the draggable window
   * @param draggable - The draggable window
   */
  updateDraggable: (id: string, draggable: Partial<Draggable>) => {
    set((state) => ({
      draggables: {
        ...state.draggables,
        [id]: state.draggables[id] ? { ...state.draggables[id]!, ...draggable } : state.draggables[id]!,
      },
    }));
  },

  /**
   * Get the highest z-index of all draggable windows
   * @returns The highest z-index
   */
  getHighestZIndex: () => {
    const draggables = get().draggables;
    const zIndexes = Object.values(draggables).map((draggable) => draggable.zIndex);
    return Math.max(0, ...zIndexes);
  },

  /**
   * Check if a draggable window is at least partially obscured by another draggable window
   * @param id - The id of the draggable window
   * @returns Whether the draggable window is obscured
   */
  isDraggableObscured: (id: string) => {
    const draggables = get().draggables;
    const draggable = draggables[id];
    if (!draggable) return false;

    let isObscured = false;
    for (const [key, value] of Object.entries(draggables)) {
      if (key === id || !value.visible) continue;
      if (
        draggable.zIndex < value.zIndex &&
        draggable.coordinates.x < value.coordinates.x + value.dimensions.width &&
        draggable.coordinates.x + draggable.dimensions.width > value.coordinates.x &&
        draggable.coordinates.y < value.coordinates.y + value.dimensions.height &&
        draggable.coordinates.y + draggable.dimensions.height > value.coordinates.y
      ) {
        isObscured = true;
        break;
      }
    }

    return isObscured;
  },
}));
