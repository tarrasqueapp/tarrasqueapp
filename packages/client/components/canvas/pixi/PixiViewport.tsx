import { IViewportOptions, Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import React from 'react';
import { CustomPIXIComponent } from 'react-pixi-fiber';

interface IViewportProps extends IViewportOptions {
  onLoad?: (viewport: Viewport) => void;
  onBeforeSingleClick?: (event: PIXI.InteractionEvent) => void;
  onSingleClick?: (event: PIXI.InteractionEvent) => void;
  onDoubleClick?: (event: PIXI.InteractionEvent) => void;
  onRightClick?: (event: PIXI.InteractionEvent) => void;
  isTrackpad?: boolean;
  pressToDrag?: boolean;
  children?: React.ReactNode;
}

export const PixiViewport = CustomPIXIComponent<Viewport, IViewportProps>(
  {
    customDisplayObject: (props) => {
      const viewport = new Viewport({
        passiveWheel: false,
        disableOnContextMenu: true,
        ...props,
      });
      viewport.drag().pinch().wheel({ trackpadPinch: true, wheelZoom: false }).clampZoom({ minScale: 0.1 });

      let clicks = 0;
      let pressed = false;
      let clickTimer: ReturnType<typeof setTimeout>;
      let longPressTimer: ReturnType<typeof setTimeout>;
      const doubleClickTimespan = 500;
      const longPressTimespan = 500;

      viewport.on('pointerdown', (event) => {
        if (event.data.originalEvent.button === 2) {
          props.onRightClick?.(event);
          return;
        }
        pressed = true;
        clicks++;
        if (clicks === 1) {
          props.onBeforeSingleClick?.(event);
          clickTimer = setTimeout(() => {
            clicks = 0;
            if (!pressed) {
              props.onSingleClick?.(event);
            }
          }, doubleClickTimespan);
        } else if (clicks === 2) {
          clicks = 0;
          clearTimeout(clickTimer);
          props.onDoubleClick?.(event);
        }
        longPressTimer = setTimeout(() => {
          props.onRightClick?.(event);
        }, longPressTimespan);
      });

      viewport.on('drag-start', () => {
        clicks = 0;
        clearTimeout(clickTimer);
      });

      viewport.on('pointermove', () => {
        clicks = 0;
        clearTimeout(longPressTimer);
      });

      viewport.on('pointerup', () => {
        pressed = false;
        clearTimeout(longPressTimer);
      });

      props.onLoad?.(viewport);

      return viewport;
    },
    customApplyProps: (viewport, oldProps, newProps) => {
      if (!oldProps) return;
      if (oldProps.isTrackpad !== newProps.isTrackpad) {
        viewport.wheel({ trackpadPinch: true, wheelZoom: !newProps.isTrackpad });
      }
      if (oldProps.screenWidth !== newProps.screenWidth || oldProps.screenHeight !== newProps.screenHeight) {
        viewport.resize(newProps.screenWidth, newProps.screenHeight);
      }
      if (oldProps.pressToDrag !== newProps.pressToDrag) {
        viewport.drag({ pressDrag: newProps.pressToDrag });
      }
    },
  },
  'Viewport',
);
