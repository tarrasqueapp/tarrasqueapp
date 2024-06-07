'use client';

import { CampaignModal, useCampaignStore } from '@/store/useCampaignStore';

import { CampaignMembersModal } from './CampaignMembersModal';
import { CampaignPluginsModal } from './CampaignPluginsModal';
import { CreateUpdateCampaignModal } from './CreateUpdateCampaignModal';
import { DeleteCampaignModal } from './DeleteCampaignModal';

export function CampaignModals() {
  const modal = useCampaignStore((state) => state.modal);
  const selectedCampaignId = useCampaignStore((state) => state.selectedCampaignId);
  const setModal = useCampaignStore((state) => state.setModal);
  const setSelectedCampaignId = useCampaignStore((state) => state.setSelectedCampaignId);

  /**
   * Close the modal and reset the selected campaign
   */
  function handleCloseModal() {
    setModal(null);
    setTimeout(() => setSelectedCampaignId(null), 100);
  }

  return (
    <>
      {modal === CampaignModal.CreateUpdate && (
        <CreateUpdateCampaignModal open onClose={handleCloseModal} campaignId={selectedCampaignId!} />
      )}

      {modal === CampaignModal.Members && (
        <CampaignMembersModal open onClose={handleCloseModal} campaignId={selectedCampaignId!} />
      )}

      {modal === CampaignModal.Plugins && (
        <CampaignPluginsModal open onClose={handleCloseModal} campaignId={selectedCampaignId!} />
      )}

      {modal === CampaignModal.Delete && (
        <DeleteCampaignModal open onClose={handleCloseModal} campaignId={selectedCampaignId!} />
      )}
    </>
  );
}
