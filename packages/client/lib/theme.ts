import { alpha, createTheme, filledInputClasses, formLabelClasses, responsiveFontSizes } from '@mui/material';
import { Raleway, Recursive } from '@next/font/google';

import { Color } from './colors';

const raleway = Raleway({ subsets: ['latin'] });
const recursive = Recursive({ subsets: ['latin'] });

export let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: Color.BrownLight },
    secondary: { main: Color.Purple },
    error: { main: Color.Red },
    warning: { main: Color.Orange },
    info: { main: Color.Blue },
    success: { main: Color.Green },
    background: { default: Color.BlackLight, paper: Color.BrownVeryDark },
  },
  typography: {
    fontSize: 15,
    fontFamily: raleway.style.fontFamily,
    h1: { fontFamily: recursive.style.fontFamily, fontSize: 44, lineHeight: 1, fontWeight: 600 },
    h2: { fontFamily: recursive.style.fontFamily, fontSize: 34, lineHeight: 0.94, fontWeight: 400 },
    h3: { fontFamily: recursive.style.fontFamily, fontSize: 24, lineHeight: 1.1 },
    h4: { fontFamily: recursive.style.fontFamily, fontSize: 20, lineHeight: 1.16 },
    h5: { fontFamily: recursive.style.fontFamily, fontSize: 16, lineHeight: 1.28 },
    body1: { lineHeight: 1.5 },
    body2: { fontSize: 15, lineHeight: 1.28 },
    caption: { fontSize: 15, lineHeight: 1.28, color: Color.Grey },
    button: { fontWeight: 500, lineHeight: 1.125 },
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
          fontWeight: 500,
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
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    // Navigation
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          background: alpha(Color.BlackLight, 0.8),
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '80px !important',
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
          background: alpha(Color.BlackLight, 0.8),
        },
      },
    },
    // Forms
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '90px',
          boxShadow: 'none !important',
        },
        sizeMedium: {
          padding: '12px 20px',
        },
        sizeLarge: {
          padding: '18px 40px',
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 'bold',
        },
      },
    },
    // Lists
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(Color.BrownLight, 0.1),
          },
        },
      },
    },
    // Accordion
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        elevation: 0,
        square: true,
      },
      styleOverrides: {
        root: {
          border: `1px solid rgba(255, 255, 255, 0.12)`,
          '&:before': {
            display: 'none',
          },
          boxShadow: 'none',
          background: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: '10px 10px',
          '&.Mui-expanded': {
            borderRadius: '10px 10px 0 0',
          },
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0,
          borderTop: '1px solid rgba(0, 0, 0, 0.125)',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);
