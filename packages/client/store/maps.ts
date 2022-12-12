import { makeAutoObservable } from 'mobx';

import { MapInterface } from '../lib/types';

export enum MapModal {
  CreateUpdate = 'create-update',
  Delete = 'delete',
}

class MapsStore {
  selectedMap = null as unknown as MapInterface | null;
  modal = null as unknown as MapModal | null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Set the selected map to edit or remove
   * @param map - The map to edit or remove
   */
  setSelectedMap(map: MapInterface | null) {
    this.selectedMap = map;
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
