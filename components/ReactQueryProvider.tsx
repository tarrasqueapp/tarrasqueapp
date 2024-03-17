'use client';

import { Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePathname } from 'next/navigation';
import { Suspense, lazy, useEffect, useState } from 'react';

import { AppNavigation } from '@/utils/navigation';

declare global {
  interface Window {
    toggleDevtools: () => void;
  }
}

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [showDevtools, setShowDevtools] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
  );
  const pathname = usePathname();

  // Add a global function to toggle the devtools
  useEffect(() => {
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <Box sx={{ position: 'fixed', bottom: pathname.startsWith(AppNavigation.Map) ? 78 : 10, right: 10 }}>
        <ReactQueryDevtools initialIsOpen={false} position="right" buttonPosition="relative" />

        {showDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction position="right" buttonPosition="relative" />
          </Suspense>
        )}
      </Box>
    </QueryClientProvider>
  );
}
