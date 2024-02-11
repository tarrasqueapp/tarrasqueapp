import { create } from 'zustand';

export enum CampaignModal {
  CreateUpdate = 'create-update',
  Members = 'members',
  Delete = 'delete',
  Plugins = 'plugins',
}

interface CampaignStore {
  selectedCampaignId: string | null;
  modal: CampaignModal | null;
  setSelectedCampaignId: (campaignId: string | null) => void;
  setModal: (modal: CampaignModal | null) => void;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  selectedCampaignId: null,
  modal: null,

  /**
   * Set the selected campaign to edit or remove
   * @param campaignId - The campaign to edit or remove
   */
  setSelectedCampaignId: (campaignId) => set(() => ({ selectedCampaignId: campaignId })),

  /**
   * Set the modal to open
   * @param modal - The modal to open
   */
  setModal: (modal) => set(() => ({ modal })),
}));
