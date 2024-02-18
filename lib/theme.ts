'use client';

import { alpha, createTheme, filledInputClasses, formLabelClasses, lighten, responsiveFontSizes } from '@mui/material';
import { Raleway, Recursive } from 'next/font/google';

import { Color } from './colors';

const raleway = Raleway({ subsets: ['latin'] });
const recursive = Recursive({ subsets: ['latin'] });

export let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { light: Color.SAND_LIGHT, main: Color.SAND_MAIN, dark: Color.SAND_DARK },
    secondary: { light: Color.WHITE_LIGHT, main: Color.WHITE_MAIN, dark: Color.WHITE_DARK },
    error: { light: Color.RED_LIGHT, main: Color.RED_MAIN, dark: Color.RED_DARK },
    warning: { light: Color.ORANGE_LIGHT, main: Color.ORANGE_MAIN, dark: Color.ORANGE_DARK },
    info: { light: Color.BLUE_LIGHT, main: Color.BLUE_MAIN, dark: Color.BLUE_DARK },
    success: { light: Color.GREEN_LIGHT, main: Color.GREEN_MAIN, dark: Color.GREEN_DARK },
    background: { default: Color.BLACK_LIGHT, paper: Color.SAND_DARK },
  },
  typography: {
    fontSize: 15,
    fontFamily: raleway.style.fontFamily,
    h1: { fontFamily: recursive.style.fontFamily, fontSize: 44, lineHeight: 1, fontWeight: 600 },
    h2: { fontFamily: recursive.style.fontFamily, fontSize: 34, lineHeight: 0.94, fontWeight: 400 },
    h3: { fontFamily: recursive.style.fontFamily, fontSize: 24, lineHeight: 1.1 },
    h4: { fontFamily: recursive.style.fontFamily, fontSize: 20, lineHeight: 1.16 },
    h5: { fontFamily: recursive.style.fontFamily, fontSize: 18, lineHeight: 1.28 },
    h6: { fontFamily: recursive.style.fontFamily, fontSize: 16, lineHeight: 1.28 },
    body1: { fontSize: 15, lineHeight: 1.6 },
    body2: { fontSize: 15, lineHeight: 1.28 },
    caption: { fontSize: 15, lineHeight: 1.28, color: Color.GREY },
    button: { fontWeight: 600, lineHeight: 1.125 },
  },
  components: {
    // Global
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          background: alpha(lighten(Color.BLACK_LIGHT, 0.1), 0.9),
          backdropFilter: 'blur(5px)',
          boxShadow: 'none',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: Color.WHITE_MAIN,
          color: Color.BLACK,
          fontWeight: 600,
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
        filled: {
          fontWeight: 600,
        },
        // Standard
        outlined: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(5px)',
        },
      },
    },
    // Navigation
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          background: alpha(Color.BLACK_LIGHT, 0.8),
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
          background: alpha(Color.BLACK_LIGHT, 0.8),
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
        sizeSmall: {
          padding: '6px 16px',
        },
        sizeMedium: {
          padding: '12px 20px',
        },
        sizeLarge: {
          padding: '18px 40px',
        },
        // Outlined
        outlined: {
          color: Color.WHITE_MAIN,
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
        },
        groupedVertical: {
          '&:hover': {
            borderColor: Color.SAND_MAIN,
            '+ .MuiButton-root': {
              borderTopColor: Color.SAND_MAIN,
            },
          },
          '&:first-of-type': {
            borderRadius: '10px 10px 0 0',
          },
          '&:last-of-type': {
            borderRadius: '0 0 10px 10px',
          },
          '&:first-of-type:last-of-type': {
            borderRadius: '10px',
          },
        },
        groupedHorizontal: {
          '&:hover': {
            borderColor: Color.SAND_MAIN,
            '+ .MuiButton-root': {
              borderLeftColor: Color.SAND_MAIN,
            },
          },
          '&:first-of-type': {
            borderRadius: '10px 0 0 10px',
          },
          '&:last-of-type': {
            borderRadius: '0 10px 10px 0',
          },
          '&:first-of-type:last-of-type': {
            borderRadius: '10px',
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          '.Mui-selected': {
            background: `${Color.BROWN_MAIN} !important`,
          },
        },
        groupedVertical: {
          '&:hover': {
            borderColor: Color.SAND_MAIN,
            '+ .MuiButton-root': {
              borderTopColor: Color.SAND_MAIN,
            },
          },
          '&:first-of-type': {
            borderRadius: '10px 10px 0 0',
          },
          '&:last-of-type': {
            borderRadius: '0 0 10px 10px',
          },
          '&:first-of-type:last-of-type': {
            borderRadius: '10px',
          },
        },
        groupedHorizontal: {
          '&:hover': {
            borderColor: Color.SAND_MAIN,
            '+ .MuiButton-root': {
              borderLeftColor: Color.SAND_MAIN,
            },
          },
          '&:first-of-type': {
            borderRadius: '10px 0 0 10px',
          },
          '&:last-of-type': {
            borderRadius: '0 10px 10px 0',
          },
          '&:first-of-type:last-of-type': {
            borderRadius: '10px',
          },
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
            overflow: 'hidden',
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
              color: Color.SAND_LIGHT,
            },
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          margin: 16,
          marginTop: 0,
        },
      },
    },
    // Lists
    MuiListSubheader: {
      styleOverrides: {
        root: {
          background: 'transparent',
          fontWeight: 600,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(Color.SAND_LIGHT, 0.1),
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
    // Alert
    MuiAlert: {
      styleOverrides: {
        root: {
          alignItems: 'center',
        },
        action: {
          padding: 0,
          alignItems: 'center',
        },
        // Filled
        filled: {
          fontWeight: 600,
        },
        // Standard
        standard: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(5px)',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);
