import { store } from './store';

declare module 'pixi-graphpaper';

declare global {
  interface Window {
    store: ReturnType<typeof store>;
  }
}
