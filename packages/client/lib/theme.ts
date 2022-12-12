import { alpha, createTheme, filledInputClasses, formLabelClasses, responsiveFontSizes } from '@mui/material';

import { Color } from './colors';

export let theme = createTheme({
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
    // Global
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
    MuiSkeleton: {
      styleOverrides: {
        root: {
          transform: 'scale(1)',
        },
      },
    },
    // Navigation
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          background: alpha(Color.BlackLight, 0.9),
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          flexShrink: 0,
        },
        paper: {
          borderRadius: 0,
          boxSizing: 'border-box',
          background: alpha(Color.BlackLight, 0.9),
        },
      },
    },
    // Forms
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
          borderRadius: '10px !important',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        root: {
          [`& .${filledInputClasses.root}`]: {
            '&::before, &::after': {
              border: 'none !important',
            },
          },
        },
      },
    },
    // Dialogs
    MuiDialog: {
      styleOverrides: {
        paper: {
          display: 'flex',
          flex: '1 0 auto',
          [`& .${filledInputClasses.focused}`]: {
            [`&.${formLabelClasses.root}`]: {
              color: Color.BrownLight,
            },
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);
