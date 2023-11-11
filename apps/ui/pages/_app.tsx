import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Toaster } from 'react-hot-toast';

import { Layout } from '../components/Layout';
import { Providers } from '../components/Providers';
import createEmotionCache from '../lib/createEmotionCache';
import { theme } from '../lib/theme';
import '../styles/globals.css';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type MyAppProps = AppProps & {
  emotionCache: EmotionCache;
};

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps, emotionCache = clientSideEmotionCache }) => {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="title" content="Tarrasque App" />
        <title>Tarrasque App</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Providers>
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        </Providers>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
