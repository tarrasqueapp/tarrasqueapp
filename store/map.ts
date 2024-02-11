import { create } from 'zustand';

export enum MapModal {
  CreateUpdate = 'create-update',
  Delete = 'delete',
}

interface MapStore {
  selectedMapId: string | null;
  modal: MapModal | null;
  contextMenuVisible: boolean;
  contextMenuAnchorPoint: { x: number; y: number };
  setSelectedMapId: (mapId: string | null) => void;
  setModal: (modal: MapModal | null) => void;
  setContextMenuVisible: (contextMenuVisible: boolean) => void;
  setContextMenuAnchorPoint: (x: number, y: number) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedMapId: null,
  modal: null,
  contextMenuVisible: false,
  contextMenuAnchorPoint: { x: 0, y: 0 },

  /**
   * Set the selected map to edit or remove
   * @param mapId - The map to edit or remove
   */
  setSelectedMapId: (mapId) => {
    set(() => ({ selectedMapId: mapId }));
  },

  /**
   * Set the modal to open
   * @param modal - The modal to open
   */
  setModal: (modal) => {
    set(() => ({ modal }));
  },

  /**
   * Set the context menu visibility state
   * @param contextMenuVisible - The updated context menu visibility state
   */
  setContextMenuVisible: (contextMenuVisible) => set(() => ({ contextMenuVisible })),

  /**
   * Set the context menu anchor point
   * @param x - The x coordinate
   * @param y - The y coordinate
   */
  setContextMenuAnchorPoint: (x, y) => set(() => ({ contextMenuAnchorPoint: { x, y } })),
}));
