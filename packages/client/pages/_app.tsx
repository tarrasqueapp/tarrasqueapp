import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

import { Layout } from '../components/Layout';
import createEmotionCache from '../lib/createEmotionCache';
import { theme } from '../lib/theme';
import '../styles/globals.css';

// Show a toast message when an error occurs
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type IProps = AppProps & {
  emotionCache: EmotionCache;
};

const MyApp: React.FC<IProps> = ({ Component, pageProps, emotionCache = clientSideEmotionCache }) => {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="title" content="Tarrasque App" />
        <title>Tarrasque App</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
