import { makeAutoObservable } from 'mobx';

class MapStore {
  dimensions = { width: 0, height: 0 };

  constructor() {
    makeAutoObservable(this);
  }

  setDimensions(width: number, height: number) {
    this.dimensions.width = width;
    this.dimensions.height = height;
  }
}

export const mapStore = new MapStore();
