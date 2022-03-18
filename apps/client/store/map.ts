import { makeAutoObservable } from 'mobx';

class MapStore {
  dimensions = { width: 0, height: 0 };
  contextMenuVisible = false;
  contextMenuAnchorPoint = { top: 0, left: 0 };

  constructor() {
    makeAutoObservable(this);
  }

  setDimensions(width: number, height: number) {
    this.dimensions.width = width;
    this.dimensions.height = height;
  }

  setContextMenuVisible(contextMenuVisible: boolean) {
    this.contextMenuVisible = contextMenuVisible;
  }

  setContextMenuAnchorPoint(top: number, left: number) {
    this.contextMenuAnchorPoint.top = top;
    this.contextMenuAnchorPoint.left = left;
  }
}

export const mapStore = new MapStore();
