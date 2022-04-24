import { makeAutoObservable } from 'mobx';

class MapStore {
  id = '';
  dimensions = { width: 0, height: 0 };
  contextMenuVisible = false;
  contextMenuAnchorPoint = { x: 0, y: 0 };

  constructor() {
    makeAutoObservable(this);
  }

  setId(id: string) {
    this.id = id;
  }

  setDimensions(width: number, height: number) {
    this.dimensions.width = width;
    this.dimensions.height = height;
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
