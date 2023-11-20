import { QueryClient } from '@tanstack/react-query';

import { store } from './store';

declare global {
  interface Window {
    toggleDevtools: () => void;
    store: ReturnType<typeof store>;
    __REACT_QUERY_CLIENT__: QueryClient;
  }
}
