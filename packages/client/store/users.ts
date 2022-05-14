import { makeAutoObservable } from 'mobx';

import { CampaignInterface, Role, UserInterface } from '../lib/types';

export class UserEntity implements UserInterface {
  id = '';
  name = '';
  email = '';
  roles = [Role.USER];
  // DateTime
  createdAt = '';
  updatedAt = '';
  // Campaigns
  createdCampaigns = [] as CampaignInterface[];
  playerCampaigns = [] as CampaignInterface[];

  constructor(props: UserInterface) {
    Object.assign(this, props);
    makeAutoObservable(this);
  }
}

class UserStore {
  entities: UserEntity[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}

export const userStore = new UserStore();
