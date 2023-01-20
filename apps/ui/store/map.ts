import { makeAutoObservable } from 'mobx';

class MapStore {
  contextMenuVisible = false;
  contextMenuAnchorPoint = { x: 0, y: 0 };

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Set the context menu visibility state
   * @param contextMenuVisible - The updated context menu visibility state
   */
  setContextMenuVisible(contextMenuVisible: boolean) {
    this.contextMenuVisible = contextMenuVisible;
  }

  /**
   * Set the context menu anchor point
   * @param x - The x coordinate
   * @param y - The y coordinate
   */
  setContextMenuAnchorPoint(x: number, y: number) {
    this.contextMenuAnchorPoint.x = x;
    this.contextMenuAnchorPoint.y = y;
  }
}

export const mapStore = new MapStore();
