import { PixiComponent } from '@pixi/react';
import { IViewportOptions, Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import React from 'react';

import { CustomDragPlugin } from './CustomDragPlugin';

interface CameraBaseProps extends IViewportOptions {
  onLoad?: (viewport: Viewport) => void;
  onBeforeSingleClick?: (event: PIXI.FederatedPointerEvent) => void;
  onSingleClick?: (event: PIXI.FederatedPointerEvent) => void;
  onDoubleClick?: (event: PIXI.FederatedPointerEvent) => void;
  onRightClick?: (event: PIXI.FederatedPointerEvent) => void;
  onMove?: (viewport: Viewport) => void;
  children?: React.ReactNode;
}

export const CameraBase = PixiComponent('Camera', {
  create: (props: CameraBaseProps) => {
    // Initialize the viewport with some default options and the provided props
    const viewport = new Viewport({
      ...props,
      passiveWheel: false,
      disableOnContextMenu: true,
      events: props.events,
    });

    // Enable dragging, pinching, and wheel zooming on the viewport
    viewport.plugins.add('drag', new CustomDragPlugin(viewport));
    viewport.pinch().wheel({ trackpadPinch: true, wheelZoom: false }).clampZoom({ minScale: 0.1 });

    // State variables for tracking clicks and press events
    let clicks = 0;
    let pressed = false;
    let isDragging = false;
    let clickTimer: number | undefined;
    let longPressTimer: number | undefined;
    let lastClickTime = 0;
    const doubleClickTimespan = 500;
    const longPressTimespan = 500;

    viewport.on('pointerdown', (event) => {
      // Trigger onRightClick for right mouse button click
      if (event.nativeEvent.button === 2) {
        props.onRightClick?.(event);
        event.stopPropagation();
        return false;
      }

      pressed = true;
      const timeSinceLastClick = event.timeStamp - lastClickTime;
      lastClickTime = event.timeStamp;
      clicks++;

      if (clicks === 1) {
        props.onBeforeSingleClick?.(event); // Trigger onBeforeSingleClick

        clickTimer = window.setTimeout(() => {
          clicks = 0;
          if (!pressed && !isDragging) {
            props.onSingleClick?.(event);
          }
        }, doubleClickTimespan);

        longPressTimer = window.setTimeout(() => {
          if (pressed && !isDragging) {
            props.onRightClick?.(event); // Trigger onRightClick on long press
          }
        }, longPressTimespan);
      } else if (clicks === 2 && timeSinceLastClick < doubleClickTimespan) {
        clicks = 0;
        if (clickTimer !== undefined) {
          window.clearTimeout(clickTimer);
        }
        if (!isDragging) {
          props.onDoubleClick?.(event);
        }
      }
    });

    viewport.on('pointerup', () => {
      if (isDragging) {
        return;
      }
      pressed = false;
      if (longPressTimer !== undefined) {
        window.clearTimeout(longPressTimer);
      }
    });

    viewport.on('drag-start', () => {
      isDragging = true;
      clicks = 0;
      if (clickTimer !== undefined) {
        window.clearTimeout(clickTimer);
      }
      if (longPressTimer !== undefined) {
        window.clearTimeout(longPressTimer);
      }
    });

    viewport.on('drag-end', () => {
      isDragging = false;
    });

    viewport.on('pinch-start', () => {
      clicks = 0;
      pressed = false;
      isDragging = true;
      if (longPressTimer !== undefined) {
        window.clearTimeout(longPressTimer);
      }
    });

    viewport.on('moved-end', (event) => {
      props.onMove?.(event);
    });

    viewport.on('zoomed-end', (event) => {
      props.onMove?.(event);
    });

    props.onLoad?.(viewport);

    return viewport;
  },
  applyProps: (viewport: Viewport, oldProps, newProps) => {
    if (!oldProps) return;

    // If the screenWidth or screenHeight props changed, update the viewport dimensions
    if (oldProps.screenWidth !== newProps.screenWidth || oldProps.screenHeight !== newProps.screenHeight) {
      viewport.resize(newProps.screenWidth, newProps.screenHeight);
    }
  },
});
