import { createTheme } from '@mui/material/styles';

import { Color } from './enums';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: Color.Brown },
    secondary: { main: Color.Gold },
    error: { main: Color.Red },
    warning: { main: Color.Yellow },
    info: { main: Color.White },
    success: { main: Color.Green },
    background: { default: Color.Black, paper: Color.Black },
  },
  typography: {
    fontFamily: `"Raleway", sans-serif`,
    h1: { fontSize: 38 },
    h2: { fontSize: 32 },
    h3: { fontSize: 22 },
    h4: { fontSize: 16 },
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
