import { PixiComponent, useApp } from '@inlet/react-pixi';
import { Viewport as PixiViewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import React, { useEffect } from 'react';

import { useGetCurrentMap } from '../hooks/data/maps/useGetCurrentMap';
import { store } from '../store';
import { SelectTool, Tool } from '../store/toolbar';

export interface ViewportProps {
  worldWidth: number;
  worldHeight: number;
  screenWidth: number;
  screenHeight: number;
  onSingleClick: (event: PIXI.InteractionEvent) => void;
  onDoubleClick: (event: PIXI.InteractionEvent) => void;
  onRightClick: (event: PIXI.InteractionEvent) => void;
  children: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
  isTrackpad: boolean;
  pressToDrag: boolean;
}

const PixiComponentViewport = PixiComponent('Viewport', {
  applyProps: (viewport: PixiViewport, oldProps: PixiComponentViewportProps, newProps: PixiComponentViewportProps) => {
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
  create: (props: PixiComponentViewportProps) => {
    const viewport = new PixiViewport({
      ticker: props.app.ticker,
      passiveWheel: false,
      interaction: props.app.renderer.plugins.interaction,
      disableOnContextMenu: true,
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
        props.onRightClick(event);
        return;
      }
      pressed = true;
      clicks++;
      if (clicks === 1) {
        store.maps.setContextMenuVisible(false);
        clickTimer = setTimeout(() => {
          clicks = 0;
          if (!pressed) {
            props.onSingleClick(event);
          }
        }, doubleClickTimespan);
      } else if (clicks === 2) {
        clicks = 0;
        clearTimeout(clickTimer);
        props.onDoubleClick(event);
      }
      longPressTimer = setTimeout(() => {
        props.onRightClick(event);
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

    store.pixi.setViewport(viewport);

    return viewport;
  },
});

export const Viewport = (props: ViewportProps) => {
  const { data: map } = useGetCurrentMap();
  const app = useApp();

  useEffect(() => {
    if (!map) return;
    store.pixi.viewport.animate({
      position: { x: map.media.width / 2, y: map.media.height / 2 },
      scale: Math.min(window.innerWidth / map.media.width, window.innerHeight / map.media.height),
      time: 0,
    });
  }, [map]);

  return (
    <PixiComponentViewport
      app={app}
      isTrackpad={store.app.isTrackpad}
      pressToDrag={store.toolbar.tool === Tool.Select && store.toolbar.selectTool === SelectTool.Single}
      {...props}
    />
  );
};
