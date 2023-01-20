import { makeAutoObservable } from 'mobx';

export enum CampaignModal {
  CreateUpdate = 'create-update',
  Members = 'members',
  Delete = 'delete',
}

class CampaignsStore {
  selectedCampaignId = null as unknown as string | null;
  modal = null as unknown as CampaignModal | null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Set the selected campaign to edit or remove
   * @param campaignId - The campaign to edit or remove
   */
  setSelectedCampaignId(campaignId: string | null) {
    this.selectedCampaignId = campaignId;
  }

  /**
   * Set the modal to open
   * @param modal - The modal to open
   */
  setModal(modal: CampaignModal | null) {
    this.modal = modal;
  }
}

export const campaignsStore = new CampaignsStore();
