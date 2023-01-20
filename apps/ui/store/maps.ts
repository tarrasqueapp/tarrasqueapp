import { makeAutoObservable } from 'mobx';

export enum MapModal {
  CreateUpdate = 'create-update',
  Delete = 'delete',
}

class MapsStore {
  selectedMapId = null as unknown as string | null;
  modal = null as unknown as MapModal | null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Set the selected map to edit or remove
   * @param mapId - The map to edit or remove
   */
  setSelectedMapId(mapId: string | null) {
    this.selectedMapId = mapId;
  }

  /**
   * Set the modal to open
   * @param modal - The modal to open
   */
  setModal(modal: MapModal | null) {
    this.modal = modal;
  }
}

export const mapsStore = new MapsStore();
