import { store } from './store';

declare global {
  interface Window {
    toggleDevtools: () => void;
    store: ReturnType<typeof store>;
  }
}
