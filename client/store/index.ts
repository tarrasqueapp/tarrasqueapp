import { enableStaticRendering } from 'mobx-react-lite';

import { appStore } from './app';
import { mapStore } from './map';
import { pixiStore } from './pixi';
import { toolbarStore } from './toolbar';

const isServer = typeof window === 'undefined';
enableStaticRendering(isServer);

export const store = {
  app: appStore,
  map: mapStore,
  pixi: pixiStore,
  toolbar: toolbarStore,
};

if (!isServer) {
  window.store = store;
}
