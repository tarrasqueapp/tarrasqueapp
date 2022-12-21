import * as PIXI from 'pixi.js';
import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { Color } from '../../lib/colors';
import { HotkeysUtils } from '../../utils/HotkeyUtils';
import { GridBase } from './GridBase';

interface GridProps {
  width: number;
  height: number;
}

export const Grid: React.FC<GridProps> = ({ width, height }) => {
  const [visible, setVisible] = useState(true);

  // Register hotkey
  useHotkeys(HotkeysUtils.Grid, () => setVisible((visible) => !visible), [visible]);

  if (!visible) return null;

  return <GridBase width={width} height={height} size={70} color={PIXI.utils.string2hex(Color.Black)} />;
};
