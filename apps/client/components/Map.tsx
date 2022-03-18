import { Sprite } from '@inlet/react-pixi';

import { Viewport } from './Viewport';

export interface IMapProps {
  src: string;
  width: number;
  height: number;
}

export const Map: React.FC<IMapProps> = ({ src, width, height, children }) => {
  return (
    <Viewport worldWidth={width} worldHeight={height}>
      <Sprite image={src} x={0} y={0} anchor={0} />
      {children}
    </Viewport>
  );
};
