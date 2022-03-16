import { Sprite } from '@inlet/react-pixi';
import { useState } from 'react';

export interface ITokenProps {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const Token: React.FC<ITokenProps> = ({ src, x, y, width, height }) => {
  const [moving, setMoving] = useState(false);

  return (
    <Sprite
      image={src}
      x={width / 2 + x}
      y={height / 2 + y}
      anchor={0.5}
      width={width}
      height={height}
      interactive
      pointerdown={() => setMoving(true)}
      pointerup={() => setMoving(false)}
      pointermove={(e) => {
        if (!moving) return;
        console.log(e);
      }}
    />
  );
};
