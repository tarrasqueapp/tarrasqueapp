import * as PIXI from 'pixi.js';
import { Sprite } from 'react-pixi-fiber';

import { Camera } from './Camera';

export interface IMapProps {
  mapId: string;
  width: number;
  height: number;
  url: string;
  children?: React.ReactNode;
}

export const Map: React.FC<IMapProps> = ({ mapId, width, height, url, children }) => {
  return (
    <Camera mapId={mapId} width={width} height={height}>
      <Sprite texture={PIXI.Texture.from(url)} x={0} y={0} anchor={0} />
      {children}
    </Camera>
  );
};
