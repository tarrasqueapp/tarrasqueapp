import { observer } from 'mobx-react-lite';
import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import React, { useEffect } from 'react';
import { usePixiApp } from 'react-pixi-fiber';

import { useWindowSize } from '../../hooks/useWindowSize';
import { store } from '../../store';
import { SelectTool, Tool } from '../../store/toolbar';
import { PixiViewport } from './pixi/PixiViewport';

interface ICameraProps {
  mapId: string;
  width: number;
  height: number;
  children?: React.ReactNode;
}

export const Camera: React.FC<ICameraProps> = observer(({ mapId, width, height, children }) => {
  const app = usePixiApp();
  const windowSize = useWindowSize();

  useEffect(() => {
    store.pixi.viewport.animate({
      position: { x: width / 2, y: height / 2 },
      scale: Math.min(window.innerWidth / width, window.innerHeight / height),
      time: 0,
    });
  }, [width, height]);

  useEffect(() => {
    function detectTrackPad(event: Event) {
      if ((event as any).wheelDeltaY) {
        if ((event as any).wheelDeltaY === (event as any).deltaY * -3) {
          store.app.setIsTrackpad(true);
        }
      } else if ((event as any).deltaMode === 0) {
        store.app.setIsTrackpad(true);
      } else {
        store.app.setIsTrackpad(false);
      }
    }

    document.addEventListener('mousewheel', detectTrackPad);
    document.addEventListener('DOMMouseScroll', detectTrackPad);
  }, []);

  function handleLoad(viewport: Viewport) {
    console.debug('Map loaded.');
    store.pixi.setViewport(viewport);
  }

  function handleBeforeSingleClick() {
    console.debug('Before Single Click.');
    store.maps.setContextMenuVisible(false);
  }

  function handleSingleClick() {
    console.debug('Single Click.');
  }

  function handleDoubleClick(event: PIXI.InteractionEvent) {
    console.debug('Double Click.');
    store.app.socket.emit('pingLocation', { mapId, ...event.data.global });
  }

  function handleRightClick(event: PIXI.InteractionEvent) {
    console.debug('Right Click.', event.data.global);
    store.maps.setContextMenuVisible(false);
    store.maps.setContextMenuAnchorPoint(event.data.global.x, event.data.global.y);
    store.maps.setContextMenuVisible(true);
  }

  return (
    <PixiViewport
      worldWidth={width}
      worldHeight={height}
      screenWidth={windowSize.width}
      screenHeight={windowSize.height}
      ticker={app.ticker}
      interaction={app.renderer.plugins.interaction}
      onLoad={handleLoad}
      onBeforeSingleClick={handleBeforeSingleClick}
      onSingleClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      onRightClick={handleRightClick}
      isTrackpad={store.app.isTrackpad}
      pressToDrag={store.toolbar.tool === Tool.Select && store.toolbar.selectTool === SelectTool.Single}
    >
      {children}
    </PixiViewport>
  );
});
