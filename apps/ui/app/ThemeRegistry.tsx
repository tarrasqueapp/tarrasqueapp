'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import * as React from 'react';

import { theme } from '../lib/theme';
import { EmotionCacheProvider } from './EmotionCacheProvider';

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {children}
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
