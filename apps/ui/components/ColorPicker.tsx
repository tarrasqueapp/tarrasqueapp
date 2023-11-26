import { Box, Popover } from '@mui/material';
import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from '@mui/material/colors';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useDebouncyEffect } from 'use-debouncy';

import { Color } from '../lib/colors';
import { Swatch } from './ColorPicker/Swatch';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ value, onChange }: Props) {
  const [color, setValue] = useState(value);
  useDebouncyEffect(() => onChange(color), 200, [color]);

  const presetColors = [
    red[500],
    pink[500],
    purple[500],
    deepPurple[500],
    indigo[500],
    blue[500],
    lightBlue[500],
    cyan[500],
    teal[500],
    green[500],
    lightGreen[500],
    lime[500],
    yellow[500],
    amber[500],
    orange[500],
    deepOrange[500],
    brown[500],
    grey[500],
    blueGrey[500],
    Color.BLACK,
    Color.WHITE,
  ];

  return (
    <PopupState variant="popover" popupId="colorpicker">
      {(popupState) => (
        <>
          <Swatch {...bindTrigger(popupState)} value={color} />

          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            sx={{
              '& .MuiPopover-paper': {
                overflow: 'visible',
                width: 300,
              },
            }}
          >
            <HexColorPicker
              style={{ width: '100%' }}
              color={color}
              onChange={(color) => {
                setValue(color);
              }}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}>
              {presetColors.map((presetColor) => (
                <Swatch key={presetColor} value={presetColor} onClick={() => setValue(presetColor)} />
              ))}
            </Box>
          </Popover>
        </>
      )}
    </PopupState>
  );
}
