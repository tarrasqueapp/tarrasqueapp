import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

interface ReactQueryProviderProps {
  dehydratedState: DehydratedState;
  children: React.ReactNode;
}

export function ReactQueryProvider({ dehydratedState, children }: ReactQueryProviderProps) {
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

  // Add a global function to toggle the devtools
  useEffect(() => {
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  // Set the query client on the window so that it can be accessed by the SDK
  useEffect(() => {
    if (!queryClient) return;
    window.__REACT_QUERY_CLIENT__ = queryClient;
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        {children}

        {showDevtools && (
          <React.Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </React.Suspense>
        )}
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
