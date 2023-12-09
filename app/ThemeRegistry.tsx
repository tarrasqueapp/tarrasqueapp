'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';

import { theme } from '@/lib/theme';

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
