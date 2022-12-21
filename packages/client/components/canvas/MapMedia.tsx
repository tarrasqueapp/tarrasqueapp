import * as PIXI from 'pixi.js';
import { Sprite } from 'react-pixi-fiber';

interface MapMediaProps {
  url: string;
}

export const MapMedia: React.FC<MapMediaProps> = ({ url }) => {
  return <Sprite texture={PIXI.Texture.from(url)} x={0} y={0} anchor={0} />;
};
