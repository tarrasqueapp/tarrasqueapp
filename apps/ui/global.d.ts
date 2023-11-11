import { store } from './store';

declare global {
  interface Window {
    store: ReturnType<typeof store>;
  }
}
