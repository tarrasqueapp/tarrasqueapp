import { createTheme } from '@mui/material/styles';

import { Color } from './enums';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: Color.Brown,
    },
    secondary: {
      main: Color.Gold,
    },
    error: {
      main: Color.Red,
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: Color.Black,
        },
      },
    },
  },
});
