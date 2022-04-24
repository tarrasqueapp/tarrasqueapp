import { enableStaticRendering } from 'mobx-react-lite';

import { appStore } from './app';
import { mapStore } from './map';

const isServer = typeof window === 'undefined';
enableStaticRendering(isServer);

export const store = {
  app: appStore,
  map: mapStore,
};

if (!isServer) {
  window.store = store;
}
