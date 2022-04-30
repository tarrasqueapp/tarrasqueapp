import { makeAutoObservable } from 'mobx';

import { PluginInterface } from '../lib/types';

export class PluginEntity implements PluginInterface {
  id = '';
  name = '';
  url = '';
  // DateTime
  createdAt = '';
  updatedAt = '';

  constructor(props: PluginInterface) {
    Object.assign(this, props);
    makeAutoObservable(this);
  }
}

class PluginStore {
  entities: PluginEntity[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}

export const pluginStore = new PluginStore();
