import { Coordinates, Map, logger } from '@tarrasque/common';
import { Viewport } from '@tarrasque/pixi-viewport';
import { TarrasqueSDK } from '@tarrasque/sdk';
import * as PIXI from 'pixi.js';

import { CustomDragPlugin } from './CustomDragPlugin';

interface CameraProps {
  app: PIXI.Application;
  sdk: TarrasqueSDK;
  map: Map;
}

export class Camera {
  sdk: TarrasqueSDK;
  map: Map;
  viewport: Viewport;
  pressed = false;
  isDragging = false;
  clicks = 0;
  clickTimer: number | undefined;
  pointerLocation: Coordinates;
  longPressTimer: number | undefined;
  lastClickTime = 0;
  doubleClickTimespan = 500;
  longPressTimespan = 500;

  constructor({ app, sdk, map }: CameraProps) {
    this.sdk = sdk;
    this.map = map;

    // Initialize the viewport with some default options and the provided props
    this.viewport = new Viewport({
      worldWidth: this.map.media.width,
      worldHeight: this.map.media.height,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      events: app.renderer.events,
      passiveWheel: false,
      disableOnContextMenu: true,
    });

    // Enable dragging, pinching, and wheel zooming on the viewport
    this.viewport.plugins.add('drag', new CustomDragPlugin(this.viewport, this.sdk));
    this.viewport.pinch().wheel({ trackpadPinch: true, wheelZoom: false }).clampZoom({ minScale: 0.1 });

    this.viewport.on('pointerdown', this.onPointerDown);
    this.viewport.on('pointerup', this.onPointerUp);
    this.viewport.on('pointermove', this.onPointerMove);
    this.viewport.on('drag-start', this.onDragStart);
    this.viewport.on('drag-end', this.onDragEnd);
    this.viewport.on('pinch-start', this.onPinchStart);
    this.viewport.on('moved-end', this.onMovedEnd);
    this.viewport.on('zoomed-end', this.onZoomedEnd);

    app.stage.addChild(this.viewport);

    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
  }

  /**
   * Handle the load event
   * @param viewport - The viewport instance
   */
  onLoad() {
    logger.debug('Viewport loaded.');
  }

  /**
   * Hide the context menu before a single click event
   */
  onBeforeSingleClick() {
    logger.debug('Before Single Click.');
    // setContextMenuVisible(false);
  }

  /**
   * Handle the click event
   */
  onSingleClick() {
    logger.debug('Single Click.');
  }

  /**
   * Handle the double click event
   * @param event - The interaction event
   */
  onDoubleClick(event: PIXI.FederatedPointerEvent) {
    logger.debug('Double Click.', event.global);
  }

  /**
   * Handle the right click event
   * @param event - The interaction event
   */
  onRightClick(event: PIXI.FederatedPointerEvent) {
    logger.debug('Right Click.', event.global);
    // setContextMenuVisible(false);
    // Update the app state with the global coordinates of the right click event
    // setContextMenuAnchorPoint(event.global.x, event.global.y);
    // setContextMenuVisible(true);
  }

  /**
   * Update the camera position state when the viewport is moved
   * @param viewport - The viewport instance
   */
  onMove(viewport: Viewport) {
    logger.debug('Move.');
    const coordinates = { x: viewport.center.x, y: viewport.center.y };
    const scale = (viewport.scale.x + viewport.scale.y) / 2;
    this.sdk.emitter.emit('SET_CAMERA_COORDINATES', coordinates);
    this.sdk.emitter.emit('SET_CAMERA_SCALE', scale);
  }

  onResize() {
    this.viewport.resize(window.innerWidth, window.innerHeight);
  }

  async onPointerDown(event: PIXI.FederatedPointerEvent) {
    const aligningGrid = await this.sdk.grid.getAligningStatus();
    if (aligningGrid) return;

    // Trigger onRightClick for right mouse button click
    if (event.nativeEvent.button === 2) {
      this.onRightClick(event);
      event.stopPropagation();
      return false;
    }

    this.pressed = true;
    const timeSinceLastClick = event.timeStamp - this.lastClickTime;
    this.lastClickTime = event.timeStamp;
    const clickLocation = { x: event.global.x, y: event.global.y };
    this.clicks++;

    if (this.clicks === 1) {
      this.onBeforeSingleClick();

      this.clickTimer = window.setTimeout(() => {
        this.clicks = 0;
        if (!this.pressed && !this.isDragging) {
          this.onSingleClick();
        }
      }, this.doubleClickTimespan);

      this.longPressTimer = window.setTimeout(() => {
        if (
          this.pressed &&
          !this.isDragging &&
          this.pointerLocation.x === clickLocation.x &&
          this.pointerLocation.y === clickLocation.y
        ) {
          this.onRightClick(event); // Trigger onRightClick on long press
        }
      }, this.longPressTimespan);
    } else if (this.clicks === 2 && timeSinceLastClick < this.doubleClickTimespan) {
      this.clicks = 0;
      if (this.clickTimer !== undefined) {
        window.clearTimeout(this.clickTimer);
      }
      if (!this.isDragging) {
        this.onDoubleClick(event);
      }
    }
  }

  onPointerUp() {
    if (this.isDragging) {
      return;
    }
    this.pressed = false;
    if (this.longPressTimer !== undefined) {
      window.clearTimeout(this.longPressTimer);
    }
  }

  onPointerMove(event: PIXI.FederatedPointerEvent) {
    this.pointerLocation = { x: event.global.x, y: event.global.y };
  }

  onDragStart() {
    this.isDragging = true;
    this.clicks = 0;
    if (this.clickTimer !== undefined) {
      window.clearTimeout(this.clickTimer);
    }
    if (this.longPressTimer !== undefined) {
      window.clearTimeout(this.longPressTimer);
    }
  }

  onDragEnd() {
    this.isDragging = false;
  }

  onPinchStart() {
    this.clicks = 0;
    this.pressed = false;
    this.isDragging = true;
    if (this.longPressTimer !== undefined) {
      window.clearTimeout(this.longPressTimer);
    }
  }

  onMovedEnd(viewport: Viewport) {
    this.onMove(viewport);
  }

  onZoomedEnd(viewport: Viewport) {
    this.onMove(viewport);
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('orientationchange', this.onResize);
    this.viewport.destroy();
  }
}
