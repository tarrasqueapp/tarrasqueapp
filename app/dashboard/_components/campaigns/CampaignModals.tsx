'use client';

import { Alert } from '@mui/material';
import { toast } from 'react-hot-toast';

import { deleteCampaign } from '@/actions/campaigns';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useGetUserCampaigns } from '@/hooks/data/campaigns/useGetUserCampaigns';
import { CampaignModal, useCampaignStore } from '@/store/campaign';

import { CampaignMembersModal } from './CampaignMembersModal';
import { CampaignPluginsModal } from './CampaignPluginsModal';
import { CreateUpdateCampaignModal } from './CreateUpdateCampaignModal';

export function CampaignModals() {
  const { data: campaigns } = useGetUserCampaigns();

  const modal = useCampaignStore((state) => state.modal);
  const selectedCampaignId = useCampaignStore((state) => state.selectedCampaignId);
  const setModal = useCampaignStore((state) => state.setModal);
  const setSelectedCampaignId = useCampaignStore((state) => state.setSelectedCampaignId);

  const selectedCampaign = campaigns?.find((campaign) => campaign.id === selectedCampaignId);

  /**
   * Close the modal and reset the selected campaign
   */
  function handleCloseModal() {
    setModal(null);
    setTimeout(() => setSelectedCampaignId(null), 100);
  }

  /**
   * Handle deleting a campaign
   */
  async function handleDeleteSelectedCampaign() {
    if (!selectedCampaign) return;

    const response = await deleteCampaign({ id: selectedCampaign.id });

    if (response?.error) {
      toast.error(response.error);
      return;
    }
  }

  return (
    <>
      <CreateUpdateCampaignModal
        open={modal === CampaignModal.CreateUpdate}
        onClose={handleCloseModal}
        campaign={selectedCampaign}
      />

      <CampaignMembersModal
        open={modal === CampaignModal.Members}
        onClose={handleCloseModal}
        campaign={selectedCampaign}
      />

      <CampaignPluginsModal
        open={modal === CampaignModal.Plugins}
        onClose={handleCloseModal}
        campaign={selectedCampaign}
      />

      <ConfirmModal
        title="Delete Campaign"
        open={modal === CampaignModal.Delete}
        onConfirm={handleDeleteSelectedCampaign}
        onClose={handleCloseModal}
      >
        <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        You&apos;re about to delete the campaign &quot;<strong>{selectedCampaign?.name}</strong>&quot; and all of its
        maps, characters, and associated data.
      </ConfirmModal>
    </>
  );
}
