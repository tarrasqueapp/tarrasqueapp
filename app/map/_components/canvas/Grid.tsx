import { Container } from '@pixi/react';
import * as PIXI from 'pixi.js';
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { usePixiStore } from '@/store/pixi';
import { HotkeysUtils } from '@/utils/HotkeyUtils';

interface GridProps {
  size: number;
  color: string;
}

export function Grid({ size, color }: GridProps) {
  const [visible, setVisible] = useState(true);
  const map = usePixiStore((state) => state.map);

  // Container for batch drawing
  const containerRef = useRef(new PIXI.Container());
  const graphicsRef = useRef(new PIXI.Graphics());

  // Register hotkey
  useHotkeys(HotkeysUtils.Grid, () => setVisible((visible) => !visible), [visible]);

  useEffect(() => {
    if (!visible || !map?.media?.width || !map?.media?.height) return;

    const graphics = graphicsRef.current;
    graphics.clear();

    const convertedColor = new PIXI.Color(color);
    graphics.lineStyle(1, convertedColor);

    const rows = map.media.width / size;
    const columns = map.media.height / size;

    // Add extra rows and columns to cover the entire map
    const extraRowsColumns = 50;

    // Draw the grid
    for (let row = -extraRowsColumns; row < rows + extraRowsColumns; row++) {
      for (let column = -extraRowsColumns; column < columns + extraRowsColumns; column++) {
        graphics.drawRect(row * size, column * size, size, size);
      }
    }

    // Add the graphics to the container for batch drawing
    const container = containerRef.current;
    if (!container.children.includes(graphics)) {
      container.addChild(graphics);
    }
  }, [visible, size, color, map]);

  if (!visible) return null;

  return <Container ref={containerRef} />;
}
