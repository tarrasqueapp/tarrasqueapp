import { createTheme } from '@mui/material/styles';

import { Color } from './colors';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: Color.Brown },
    secondary: { main: Color.BlueDark },
    info: { main: Color.White },
    background: { default: Color.BlackLight, paper: Color.BrownVeryDark },
  },
  typography: {
    fontFamily: `"Raleway", sans-serif`,
    h1: { fontSize: 38 },
    h2: { fontSize: 32 },
    h3: { fontSize: 22 },
    h4: { fontSize: 16 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        followCursor: true,
      },
      styleOverrides: {
        tooltip: {
          backgroundColor: Color.BrownDark,
          fontWeight: 'bold',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          background: Color.BrownVeryDark,
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px !important',
          padding: '8px 20px',
          fontWeight: 'bold',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '10px 10px 0 0 !important',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          transform: 'scale(1)',
        },
      },
    },
  },
});
