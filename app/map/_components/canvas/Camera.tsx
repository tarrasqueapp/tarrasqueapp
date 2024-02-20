import { useApp } from '@pixi/react';
import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import React, { useEffect, useState } from 'react';

import { useWindowSize } from '@/hooks/useWindowSize';
import { useMapStore } from '@/store/map';
import { usePixiStore } from '@/store/pixi';

import { CameraBase } from './CameraBase';

interface CameraProps {
  mapId: string;
  width: number;
  height: number;
  children?: React.ReactNode;
}

export function Camera({ mapId, width, height, children }: CameraProps) {
  const { viewport, setViewport, getPosition, setPosition } = usePixiStore();
  const { setContextMenuVisible, setContextMenuAnchorPoint } = useMapStore();

  const app = useApp();
  const windowSize = useWindowSize();

  const [mounted, setMounted] = useState(false);

  // Center the viewport on the map when it is first rendered
  useEffect(() => {
    if (mounted || !viewport || viewport.destroyed) return;

    let position = getPosition(mapId);
    if (!position) {
      position = {
        x: width / 2,
        y: height / 2,
        scale: Math.min(windowSize.width / width, windowSize.height / height),
      };
    }

    viewport.animate({
      position: {
        x: position.x,
        y: position.y,
      },
      scale: position.scale,
      time: 0,
    });

    setMounted(true);
  }, [viewport]);

  // const membership = user?.memberships.find((membership) => membership.campaignId === map?.campaign_id);

  /**
   * Handle the load event
   * @param viewport - The viewport instance
   */
  function handleLoad(viewport: Viewport) {
    console.debug('Map loaded.');
    setViewport(viewport);
  }

  /**
   * Hide the context menu before a single click event
   */
  function handleBeforeSingleClick() {
    console.debug('Before Single Click.');
    setContextMenuVisible(false);
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
  function handleDoubleClick(event: PIXI.FederatedPointerEvent) {
    if (!viewport) return;

    console.debug('Double Click.', event.global);
  }

  /**
   * Handle the right click event
   * @param event - The interaction event
   */
  function handleRightClick(event: PIXI.FederatedPointerEvent) {
    console.debug('Right Click.', event.global);
    setContextMenuVisible(false);
    // Update the app state with the global coordinates of the right click event
    setContextMenuAnchorPoint(event.global.x, event.global.y);
    setContextMenuVisible(true);
  }

  /**
   * Update the camera position state when the viewport is moved
   * @param viewport - The viewport instance
   */
  function handleMove(viewport: Viewport) {
    console.debug('Move.');
    const newPosition = {
      x: viewport.center.x,
      y: viewport.center.y,
      scale: (viewport.scale.x + viewport.scale.y) / 2,
    };
    setPosition(mapId, newPosition);
  }

  return (
    <CameraBase
      worldWidth={width}
      worldHeight={height}
      screenWidth={windowSize.width}
      screenHeight={windowSize.height}
      events={app.renderer.events}
      onLoad={handleLoad}
      onBeforeSingleClick={handleBeforeSingleClick}
      onSingleClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      onRightClick={handleRightClick}
      onMove={handleMove}
    >
      {children}
    </CameraBase>
  );
}
