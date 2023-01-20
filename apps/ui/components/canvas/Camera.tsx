import { observer } from 'mobx-react-lite';
import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import React, { useEffect, useState } from 'react';
import { usePixiApp } from 'react-pixi-fiber';
import useLocalStorage from 'use-local-storage';

import { useWindowSize } from '../../hooks/useWindowSize';
import { store } from '../../store';
import { SelectTool, Tool } from '../../store/toolbar';
import { CameraBase } from './CameraBase';

interface CameraProps {
  mapId: string;
  width: number;
  height: number;
  children?: React.ReactNode;
}

export const Camera: React.FC<CameraProps> = observer(({ mapId, width, height, children }) => {
  const app = usePixiApp();
  const windowSize = useWindowSize();

  // Get the camera position from local storage
  const [position, setPosition] = useLocalStorage(`map-position-${mapId}`, {
    x: width / 2,
    y: height / 2,
    scale: Math.min(windowSize.width / width, windowSize.height / height),
  });

  const [mounted, setMounted] = useState(false);

  // Center the viewport on the map when it is first rendered
  useEffect(() => {
    if (mounted) return;

    store.pixi.viewport.animate({
      position: {
        x: position.x,
        y: position.y,
      },
      scale: position.scale,
      time: 0,
    });

    setMounted(true);
  }, [position]);

  useEffect(() => {
    /**
     * Detect whether the user is using a trackpad
     * @param event - The mouse wheel event
     */
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
   * @param viewport - The viewport instance
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
    store.map.setContextMenuVisible(false);
  }

  /**
   * Handle the click event
   */
  function handleSingleClick() {
    console.debug('Single Click.');
  }

  /**
   * Handle the double click event
   * @param event - The interaction event
   */
  function handleDoubleClick(event: PIXI.InteractionEvent) {
    console.debug('Double Click.');
    // Emit a "pingLocation" event to the server, passing the map ID and the global coordinates of the click event
    store.app.socket.emit('pingLocation', { mapId, ...event.data.global });
  }

  /**
   * Handle the right click event
   * @param event - The interaction event
   */
  function handleRightClick(event: PIXI.InteractionEvent) {
    console.debug('Right Click.', event.data.global);
    store.map.setContextMenuVisible(false);
    // Update the app state with the global coordinates of the right click event
    store.map.setContextMenuAnchorPoint(event.data.global.x, event.data.global.y);
    store.map.setContextMenuVisible(true);
  }

  /**
   * Update the camera position state when the viewport is moved
   * @param viewport - The viewport instance
   */
  function handleMove(viewport: Viewport) {
    const newPosition = {
      x: viewport.center.x,
      y: viewport.center.y,
      scale: (viewport.scale.x + viewport.scale.y) / 2,
    };
    setPosition(newPosition);
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
      onMove={handleMove}
      isTrackpad={store.app.isTrackpad}
      pressToDrag={store.toolbar.tool === Tool.Select && store.toolbar.selectTool === SelectTool.Single}
    >
      {children}
    </CameraBase>
  );
});
