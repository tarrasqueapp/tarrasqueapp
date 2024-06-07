import { Coordinates } from '@tarrasque/common';

import { EventEmitter } from '../EventEmitter';

export class CameraApi {
  private emitter: EventEmitter;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  async getCoordinates() {
    return this.emitter.emit('GET_CAMERA_COORDINATES');
  }

  async setCoordinates(coordinates: Coordinates) {
    return this.emitter.emit('SET_CAMERA_COORDINATES', coordinates);
  }

  async getScale() {
    return this.emitter.emit('GET_CAMERA_SCALE');
  }

  async setScale(scale: number) {
    return this.emitter.emit('SET_CAMERA_SCALE', scale);
  }

  async zoomIn() {
    return this.emitter.emit('ZOOM_IN');
  }

  async zoomOut() {
    return this.emitter.emit('ZOOM_OUT');
  }

  async zoomToFit() {
    return this.emitter.emit('ZOOM_TO_FIT');
  }

  async animateTo(coordinates: Coordinates, scale: number) {
    return this.emitter.emit('ANIMATE_TO', { coordinates, scale });
  }
}
