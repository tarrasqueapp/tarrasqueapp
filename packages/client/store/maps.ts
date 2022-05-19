import { makeAutoObservable } from 'mobx';

class MapStore {
  contextMenuVisible = false;
  contextMenuAnchorPoint = { x: 0, y: 0 };

  constructor() {
    makeAutoObservable(this);
  }

  setContextMenuVisible(contextMenuVisible: boolean) {
    this.contextMenuVisible = contextMenuVisible;
  }

  setContextMenuAnchorPoint(x: number, y: number) {
    this.contextMenuAnchorPoint.x = x;
    this.contextMenuAnchorPoint.y = y;
  }
}

export const mapStore = new MapStore();
