'use client';

import {
  alpha,
  createTheme,
  darken,
  filledInputClasses,
  formLabelClasses,
  lighten,
  responsiveFontSizes,
} from '@mui/material';
import { Raleway, Recursive } from 'next/font/google';

import { Color } from './colors';

const raleway = Raleway({ subsets: ['latin'] });
const recursive = Recursive({ subsets: ['latin'] });

export let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: Color.BROWN_LIGHT },
    secondary: { main: Color.PURPLE },
    error: { main: Color.RED },
    warning: { main: Color.ORANGE },
    info: { main: Color.BLUE },
    success: { main: Color.GREEN },
    background: { default: Color.BLACK_LIGHT, paper: Color.BROWN_VERY_DARK },
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
    button: { fontWeight: 500, lineHeight: 1.125 },
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
          backgroundColor: Color.WHITE,
          color: Color.BLACK,
          fontWeight: 600,
        },
        arrow: {
          color: Color.WHITE,
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
        outlinedSecondary: {
          color: Color.WHITE,
          borderColor: lighten(Color.PURPLE, 0.2),
          '&:hover': {
            borderColor: lighten(Color.PURPLE, 0.4),
            backgroundColor: alpha(Color.PURPLE, 0.4),
          },
        },
        // Text
        textSecondary: {
          color: lighten(Color.PURPLE, 0.8),
          '&:hover': {
            backgroundColor: alpha(Color.PURPLE, 0.4),
          },
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
        },
        groupedVertical: {
          borderColor: 'transparent',
          '&:hover': {
            borderColor: Color.BROWN_BEIGE,
            '+ .MuiButton-root': {
              borderTopColor: Color.BROWN_BEIGE,
            },
          },
          '&:first-of-type': {
            borderRadius: '10px 10px 0 0',
          },
          '&:last-of-type': {
            borderRadius: '0 0 10px 10px',
          },
        },
        groupedHorizontal: {
          borderColor: 'transparent',
          '&:hover': {
            borderColor: Color.BROWN_BEIGE,
            '+ .MuiButton-root': {
              borderLeftColor: Color.BROWN_BEIGE,
            },
          },
          '&:first-of-type': {
            borderRadius: '10px 0 0 10px',
          },
          '&:last-of-type': {
            borderRadius: '0 10px 10px 0',
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
              color: Color.BROWN_LIGHT,
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
            backgroundColor: alpha(Color.BROWN_LIGHT, 0.1),
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
        filledError: {
          backgroundColor: darken(Color.RED, 0.1),
        },
        filledWarning: {
          backgroundColor: darken(Color.ORANGE, 0.1),
        },
        filledInfo: {
          backgroundColor: darken(Color.BLUE, 0.1),
        },
        filledSuccess: {
          backgroundColor: darken(Color.GREEN, 0.1),
        },
        // Standard
        standardError: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(5px)',
        },
        standardWarning: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(5px)',
        },
        standardInfo: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(5px)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(5px)',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);
