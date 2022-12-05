import { observer } from 'mobx-react-lite';
import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import React, { useEffect } from 'react';
import { usePixiApp } from 'react-pixi-fiber';

import { useWindowSize } from '../../hooks/useWindowSize';
import { store } from '../../store';
import { SelectTool, Tool } from '../../store/toolbar';
import { CameraBase } from './CameraBase';

interface ICameraProps {
  mapId: string;
  width: number;
  height: number;
  children?: React.ReactNode;
}

export const Camera: React.FC<ICameraProps> = observer(({ mapId, width, height, children }) => {
  const app = usePixiApp();
  const windowSize = useWindowSize();

  // Center the viewport on the map when it is first rendered
  useEffect(() => {
    store.pixi.viewport.animate({
      position: { x: width / 2, y: height / 2 },
      // Scale the viewport to fit the map within the current window dimensions
      scale: Math.min(window.innerWidth / width, window.innerHeight / height),
      time: 0,
    });
  }, [width, height]);

  // Detect whether the user is using a trackpad
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

    // Add event listeners for mouse wheel and trackpad events
    document.addEventListener('mousewheel', detectTrackPad);
    document.addEventListener('DOMMouseScroll', detectTrackPad);
  }, []);

  /**
   * Handle the load event
   * @param viewport
   */
  function handleLoad(viewport: Viewport) {
    console.debug('Map loaded.');
    store.pixi.setViewport(viewport);
  }

  /**
   * Hide the context menu before a single click event
   */
  function handleBeforeSingleClick() {
    console.debug('Before Single Click.');
    store.maps.setContextMenuVisible(false);
  }

  /**
   * Handle the click event
   */
  function handleSingleClick() {
    console.debug('Single Click.');
  }

  /**
   * Handle the double click event
   * @param event
   */
  function handleDoubleClick(event: PIXI.InteractionEvent) {
    console.debug('Double Click.');
    // Emit a "pingLocation" event to the server, passing the map ID and the global coordinates of the click event
    store.app.socket.emit('pingLocation', { mapId, ...event.data.global });
  }

  /**
   * Handle the right click event
   * @param event
   */
  function handleRightClick(event: PIXI.InteractionEvent) {
    console.debug('Right Click.', event.data.global);
    store.maps.setContextMenuVisible(false);
    // Update the app state with the global coordinates of the right click event
    store.maps.setContextMenuAnchorPoint(event.data.global.x, event.data.global.y);
    store.maps.setContextMenuVisible(true);
  }

  return (
    <CameraBase
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
    </CameraBase>
  );
});
