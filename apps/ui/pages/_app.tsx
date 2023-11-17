import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { HydrationBoundary } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { CookiesProvider } from 'react-cookie';
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

export default function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Tarrasque App</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="title" key="title" content="Tarrasque App" />
        <meta name="keywords" key="keywords" content="Tarrasque App" />
        <meta name="description" key="description" content="Tarrasque App" />

        {/* Facebook */}
        <meta name="og:type" key="og:type" content="website" />
        <meta name="og:url" key="og:url" content="https://tarrasque.app" />
        <meta name="og:title" key="og:title" content="Tarrasque App" />
        <meta name="og:description" key="og:description" content="Tarrasque App" />
        <meta name="og:image" key="og:image" content="https://tarrasque.app/images/icons/apple-splash-1334-750.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" key="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" key="twitter:url" content="https://tarrasque.app" />
        <meta name="twitter:title" key="twitter:title" content="Tarrasque App" />
        <meta name="twitter:description" key="twitter:description" content="Tarrasque App" />
        <meta
          name="twitter:image"
          key="twitter:image"
          content="https://tarrasque.app/images/icons/apple-splash-1334-750.jpg"
        />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <CookiesProvider cookies={(Component as any).universalCookies}>
          <Providers>
            <HydrationBoundary state={pageProps.dehydratedState}>
              <Layout>
                <Component {...pageProps} />
              </Layout>

              <Toaster />
            </HydrationBoundary>
          </Providers>
        </CookiesProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
