import { makeAutoObservable } from 'mobx';

import { CampaignInterface } from '../lib/types';

export enum CampaignModal {
  AddEdit = 'add',
  Remove = 'remove',
}

class CampaignStore {
  selectedCampaign = null as unknown as CampaignInterface | null;
  modal = null as unknown as CampaignModal | null;

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedCampaign(campaign: CampaignInterface | null) {
    this.selectedCampaign = campaign;
  }

  setModal(modal: CampaignModal | null) {
    this.modal = modal;
  }
}

export const campaignStore = new CampaignStore();
