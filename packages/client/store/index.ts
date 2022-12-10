import { enableStaticRendering } from 'mobx-react-lite';

import { appStore } from './app';
import { campaignsStore } from './campaigns';
import { mapStore } from './map';
import { mapsStore } from './maps';
import { mediaStore } from './media';
import { pixiStore } from './pixi';
import { toolbarStore } from './toolbar';

const isServer = typeof window === 'undefined';
enableStaticRendering(isServer);

export const store = {
  app: appStore,
  campaigns: campaignsStore,
  map: mapStore,
  maps: mapsStore,
  media: mediaStore,
  pixi: pixiStore,
  toolbar: toolbarStore,
};

if (!isServer) {
  window.store = store;
}
