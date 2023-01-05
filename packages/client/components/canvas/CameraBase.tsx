import { IViewportOptions, Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import React from 'react';
import { CustomPIXIComponent } from 'react-pixi-fiber';

interface CameraBaseProps extends IViewportOptions {
  onLoad?: (viewport: Viewport) => void;
  onBeforeSingleClick?: (event: PIXI.InteractionEvent) => void;
  onSingleClick?: (event: PIXI.InteractionEvent) => void;
  onDoubleClick?: (event: PIXI.InteractionEvent) => void;
  onRightClick?: (event: PIXI.InteractionEvent) => void;
  onMove?: (viewport: Viewport) => void;
  isTrackpad?: boolean;
  pressToDrag?: boolean;
  children?: React.ReactNode;
}

export const CameraBase = CustomPIXIComponent<Viewport, CameraBaseProps>(
  {
    customDisplayObject: (props) => {
      // Initialize the viewport with some default options and the provided props
      const viewport = new Viewport({
        passiveWheel: false,
        disableOnContextMenu: true,
        ...props,
      });

      // Enable dragging, pinching, and wheel zooming on the viewport
      viewport.drag().pinch().wheel({ trackpadPinch: true, wheelZoom: false }).clampZoom({ minScale: 0.1 });

      // State variables for tracking clicks and press events
      let clicks = 0;
      let pressed = false;
      let clickTimer: ReturnType<typeof setTimeout>;
      let longPressTimer: ReturnType<typeof setTimeout>;
      const doubleClickTimespan = 500;
      const longPressTimespan = 500;

      // Handle pointer down events (e.g. mouse down or touch start)
      viewport.on('pointerdown', (event) => {
        // Check if the event was a right click
        if (event.data.originalEvent.button === 2) {
          props.onRightClick?.(event);
          return;
        }
        pressed = true;
        clicks++;

        // If this was the first click, start a timer to track the length of the press
        if (clicks === 1) {
          props.onBeforeSingleClick?.(event);
          // Start a timer to detect a single click
          clickTimer = setTimeout(() => {
            clicks = 0;
            // Check if the pointer is still pressed
            if (!pressed) {
              props.onSingleClick?.(event);
            }
          }, doubleClickTimespan);

          // If this was the second click, reset the click count and clear the timer
        } else if (clicks === 2) {
          clicks = 0;
          clearTimeout(clickTimer);
          props.onDoubleClick?.(event);
        }

        // Start a timer to detect a long press
        longPressTimer = setTimeout(() => {
          props.onRightClick?.(event);
        }, longPressTimespan);
      });

      // Handle drag start events on the viewport
      viewport.on('drag-start', () => {
        clicks = 0;
        clearTimeout(clickTimer);
      });

      // Handle pointer move events on the viewport
      viewport.on('pointermove', () => {
        clicks = 0;
        clearTimeout(longPressTimer);
      });

      // Handle pointer up events on the viewport (e.g. mouse up or touch end)
      viewport.on('pointerup', () => {
        pressed = false;
        clearTimeout(longPressTimer);
      });

      // Don't handle long press events on the viewport if pinching
      viewport.on('pinch-start', () => {
        clicks = 0;
        pressed = false;
        clearTimeout(longPressTimer);
      });

      // Update local state when the viewport is moved
      viewport.on('moved-end', (event) => {
        props.onMove?.(event);
      });

      // Update local state when the viewport is zoomed
      viewport.on('zoomed-end', (event) => {
        props.onMove?.(event);
      });

      props.onLoad?.(viewport);

      return viewport;
    },
    customApplyProps: (viewport, oldProps, newProps) => {
      if (!oldProps) return;

      // If the isTrackpad prop changed, update the wheel zoom behavior on the viewport
      if (oldProps.isTrackpad !== newProps.isTrackpad) {
        viewport.wheel({ trackpadPinch: true, wheelZoom: !newProps.isTrackpad });
      }

      // If the screenWidth or screenHeight props changed, update the viewport dimensions
      if (oldProps.screenWidth !== newProps.screenWidth || oldProps.screenHeight !== newProps.screenHeight) {
        viewport.resize(newProps.screenWidth, newProps.screenHeight);
      }

      // If the pressToDrag prop changed, update the drag behavior on the viewport
      if (oldProps.pressToDrag !== newProps.pressToDrag) {
        viewport.drag({ pressDrag: newProps.pressToDrag });
      }
    },
  },
  'CameraBase',
);
