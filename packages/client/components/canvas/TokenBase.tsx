import * as PIXI from 'pixi.js';
import { useState } from 'react';
import { Sprite } from 'react-pixi-fiber';

interface ITokenBaseProps {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const TokenBase: React.FC<ITokenBaseProps> = ({ src, x, y, width, height }) => {
  const [moving, setMoving] = useState(false);

  return (
    <Sprite
      texture={PIXI.Texture.from(src)}
      x={width / 2 + x}
      y={height / 2 + y}
      anchor={0.5}
      width={width}
      height={height}
      interactive
      pointerdown={(e) => {
        console.debug(e);
        e.stopPropagation();
        setMoving(true);
      }}
      pointerup={() => setMoving(false)}
      pointermove={(e) => {
        if (!moving) return;
        console.debug(e);
      }}
    />
  );
};
