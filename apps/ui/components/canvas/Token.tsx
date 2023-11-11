import { Sprite, useApp } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useRef, useState } from 'react';

interface TokenProps {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function Token({ url, x, y, width, height }: TokenProps) {
  const [moving, setMoving] = useState(false);
  const [position, setPosition] = useState({ x, y });
  const app = useApp();
  const ref = useRef<PIXI.Sprite>(null);

  function handleDragMove(event: PIXI.FederatedPointerEvent) {
    if (!ref.current) return;
    ref.current.parent.toLocal(event.global, undefined, ref.current.position);
  }

  function handlePointerUp(event: PIXI.FederatedPointerEvent) {
    if (!ref.current) return;
    event.stopPropagation();
    setMoving(false);
    app.stage.off('pointermove', handleDragMove);
    app.stage.off('pointerup', handlePointerUp);

    // Center the token on the pointer
    ref.current.x -= width / 2;
    ref.current.y -= height / 2;

    // Snap the token to the grid (70px), rounding to the nearest grid square
    ref.current.x = Math.round(ref.current.x / 70) * 70;
    ref.current.y = Math.round(ref.current.y / 70) * 70;

    setPosition({ x: ref.current.x, y: ref.current.y });
  }

  function handlePointerDown(event: PIXI.FederatedPointerEvent) {
    event.stopPropagation();
    setMoving(true);
    app.stage.on('pointermove', handleDragMove);
    app.stage.on('pointerup', handlePointerUp);
  }

  return (
    <Sprite
      ref={ref}
      texture={PIXI.Texture.from(url)}
      x={width / 2 + position.x}
      y={height / 2 + position.y}
      anchor={0.5}
      width={width}
      height={height}
      eventMode="dynamic"
      cursor="pointer"
      onpointerdown={handlePointerDown}
      alpha={moving ? 0.5 : 1}
    />
  );
}
