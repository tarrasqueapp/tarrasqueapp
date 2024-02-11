import { Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { HotkeysUtils } from '@/utils/HotkeyUtils';

interface GridProps {
  width: number;
  height: number;
  size: number;
  color: string;
}

export function Grid({ width, height, size, color }: GridProps) {
  const [visible, setVisible] = useState(true);

  // Register hotkey
  useHotkeys(HotkeysUtils.Grid, () => setVisible((visible) => !visible), [visible]);

  /**
   * Draw the grid on the canvas using PIXI.Graphics
   * @param graphics - The PIXI.Graphics object
   */
  function drawGrid(graphics: PIXI.Graphics) {
    if (!visible) return;

    graphics.clear();

    // Calculate the number of rows and columns
    const rows = Math.ceil(width / size);
    const columns = Math.ceil(height / size);

    const convertedColor = new PIXI.Color(color).toNumber();
    graphics.lineStyle(1, convertedColor);
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        graphics.drawRect(row * size, column * size, size, size);
      }
    }
  }

  if (!visible) return null;

  return <Graphics draw={drawGrid} />;
}
