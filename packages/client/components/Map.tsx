import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import { useEffect } from 'react';

import { useWindowSize } from '../hooks/useWindowSize';
import { store } from '../store';
import { Viewport } from './Viewport';

export interface IMapProps {
  src: string;
  width: number;
  height: number;
  children: React.ReactElement;
}

export const Map: React.FC<IMapProps> = ({ src, width, height, children }) => {
  const windowSize = useWindowSize();

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

  function handleSingleClick() {
    console.log('Single Click.');
  }
  function handleDoubleClick(event: PIXI.InteractionEvent) {
    console.log('Double Click.');
    store.app.socket.emit('pingLocation', { mapId: store.maps.currentMap?.id, ...event.data.global });
  }
  function handleRightClick(event: PIXI.InteractionEvent) {
    console.log('Right Click.', event.data.global);
    store.maps.setContextMenuVisible(false);
    store.maps.setContextMenuAnchorPoint(event.data.global.x, event.data.global.y);
    store.maps.setContextMenuVisible(true);
  }

  return (
    <Viewport
      worldWidth={width}
      worldHeight={height}
      screenWidth={windowSize.width}
      screenHeight={windowSize.height}
      onSingleClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      onRightClick={handleRightClick}
    >
      <Sprite image={src} x={0} y={0} anchor={0} />
      {children}
    </Viewport>
  );
};
