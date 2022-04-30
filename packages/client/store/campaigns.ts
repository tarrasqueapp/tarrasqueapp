import { makeAutoObservable } from 'mobx';

import { CampaignInterface, MapInterface, UserInterface } from '../lib/types';

export class CampaignEntity implements CampaignInterface {
  id = '';
  name = '';
  // DateTime
  createdAt = '';
  updatedAt = '';
  // Media
  maps = [] as MapInterface[];
  // Players
  players = [] as UserInterface[];
  // Created by
  createdBy = null as unknown as UserInterface;
  createdById = '';

  constructor(props: CampaignInterface) {
    Object.assign(this, props);
    makeAutoObservable(this);
  }
}

class CampaignStore {
  entities: CampaignEntity[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}

export const campaignStore = new CampaignStore();
