import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

import { useWindowSize } from '../hooks/useWindowSize';
import { store } from '../store';
import { Viewport } from './Viewport';

export interface IMapProps {
  src: string;
  width: number;
  height: number;
}

export const Map: React.FC<IMapProps> = ({ src, width, height, children }) => {
  const windowSize = useWindowSize();

  function handleSingleClick() {
    console.log('Single Click.');
  }
  function handleDoubleClick(event: PIXI.InteractionEvent) {
    console.log('Double Click.');
    store.app.socket.emit('pingLocation', { mapId: store.map.id, ...event.data.global });
  }
  function handleRightClick(event: PIXI.InteractionEvent) {
    console.log('Right Click.', event.data.global);
    store.map.setContextMenuVisible(false);
    store.map.setContextMenuAnchorPoint(event.data.global.x, event.data.global.y);
    store.map.setContextMenuVisible(true);
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
