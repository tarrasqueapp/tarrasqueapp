import { enableStaticRendering } from 'mobx-react-lite';

import { appStore } from './app';
import { mapStore } from './maps';
import { mediaStore } from './media';
import { pixiStore } from './pixi';
import { toolbarStore } from './toolbar';

const isServer = typeof window === 'undefined';
enableStaticRendering(isServer);

export const store = {
  app: appStore,
  maps: mapStore,
  media: mediaStore,
  pixi: pixiStore,
  toolbar: toolbarStore,
};

if (!isServer) {
  window.store = store;
}
