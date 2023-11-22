import { enableStaticRendering } from 'mobx-react-lite';

import { campaignsStore } from './campaigns';
import { dashboardStore } from './dashboard';
import { mapStore } from './map';
import { mapsStore } from './maps';
import { mediaStore } from './media';
import { pixiStore } from './pixi';
import { toolbarStore } from './toolbar';

const isServer = typeof window === 'undefined';
enableStaticRendering(isServer);

export const store = {
  campaigns: campaignsStore,
  dashboard: dashboardStore,
  map: mapStore,
  maps: mapsStore,
  media: mediaStore,
  pixi: pixiStore,
  toolbar: toolbarStore,
};

if (!isServer) {
  window.store = store;
}
