'use client';

import { CampaignModal, useCampaignStore } from '@/store/campaign';

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
        <CreateUpdateCampaignModal
          open={modal === CampaignModal.CreateUpdate}
          onClose={handleCloseModal}
          campaignId={selectedCampaignId!}
        />
      )}

      {modal === CampaignModal.Members && (
        <CampaignMembersModal
          open={modal === CampaignModal.Members}
          onClose={handleCloseModal}
          campaignId={selectedCampaignId!}
        />
      )}

      {modal === CampaignModal.Plugins && (
        <CampaignPluginsModal
          open={modal === CampaignModal.Plugins}
          onClose={handleCloseModal}
          campaignId={selectedCampaignId!}
        />
      )}

      {modal === CampaignModal.Delete && (
        <DeleteCampaignModal
          open={modal === CampaignModal.Delete}
          onClose={handleCloseModal}
          campaignId={selectedCampaignId!}
        />
      )}
    </>
  );
}
