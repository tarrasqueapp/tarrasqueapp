import { Sprite } from '@inlet/react-pixi';

import { useWindowSize } from '../hooks/useWindowSize';
import { Viewport } from './Viewport';

export interface IMapProps {
  src: string;
  width: number;
  height: number;
}

export const Map: React.FC<IMapProps> = ({ src, width, height, children }) => {
  const windowSize = useWindowSize();

  return (
    <Viewport worldWidth={width} worldHeight={height} screenWidth={windowSize.width} screenHeight={windowSize.height}>
      <Sprite image={src} x={0} y={0} anchor={0} />
      {children}
    </Viewport>
  );
};
