import { Grid } from '@tarrasque/common';

import { EventEmitter } from '../EventEmitter';

export class GridApi {
  private emitter: EventEmitter;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  async get() {
    return this.emitter.emit('GET_GRID');
  }

  async getType() {
    return this.emitter.emit('GET_GRID_TYPE');
  }

  async setType(type: Grid['type']) {
    return this.emitter.emit('SET_GRID_TYPE', type);
  }

  async getWidth() {
    return this.emitter.emit('GET_GRID_WIDTH');
  }

  async setWidth(width: Grid['width']) {
    return this.emitter.emit('SET_GRID_WIDTH', width);
  }

  async getHeight() {
    return this.emitter.emit('GET_GRID_HEIGHT');
  }

  async setHeight(height: Grid['height']) {
    return this.emitter.emit('SET_GRID_HEIGHT', height);
  }

  async getOffsetX() {
    return this.emitter.emit('GET_GRID_OFFSET_X');
  }

  async setOffsetX(offsetX: Grid['offset_x']) {
    return this.emitter.emit('SET_GRID_OFFSET_X', offsetX);
  }

  async getOffsetY() {
    return this.emitter.emit('GET_GRID_OFFSET_Y');
  }

  async setOffsetY(offsetY: Grid['offset_y']) {
    return this.emitter.emit('SET_GRID_OFFSET_Y', offsetY);
  }

  async getColor() {
    return this.emitter.emit('GET_GRID_COLOR');
  }

  async setColor(color: Grid['color']) {
    return this.emitter.emit('SET_GRID_COLOR', color);
  }

  async getSnap() {
    return this.emitter.emit('GET_GRID_SNAP');
  }

  async setSnap(snap: Grid['snap']) {
    return this.emitter.emit('SET_GRID_SNAP', snap);
  }

  async getVisible() {
    return this.emitter.emit('GET_GRID_VISIBLE');
  }

  async setVisible(visible: Grid['visible']) {
    return this.emitter.emit('SET_GRID_VISIBLE', visible);
  }

  async getAligningStatus() {
    return this.emitter.emit('GET_GRID_ALIGNING_STATUS');
  }

  async setAligningStatus(aligningStatus: boolean) {
    return this.emitter.emit('SET_GRID_ALIGNING_STATUS', aligningStatus);
  }
}
