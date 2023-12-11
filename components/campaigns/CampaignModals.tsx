'use client';

import { Alert } from '@mui/material';

import { deleteCampaign } from '@/actions/campaigns';
import { useGetUserCampaigns } from '@/hooks/data/campaigns/useGetUserCampaigns';
import { CampaignModal, useCampaignStore } from '@/store/campaign';

import { ConfirmModal } from '../common/ConfirmModal';
import { PluginsModal } from '../dashboard/Plugins/PluginsModal';
import { CampaignMembersModal } from './CampaignMembersModal';
import { CreateUpdateCampaignModal } from './CreateUpdateCampaignModal';

export function CampaignModals() {
  const { data: campaigns } = useGetUserCampaigns();

  const { selectedCampaignId, setSelectedCampaignId, modal, setModal } = useCampaignStore();

  const selectedCampaign = campaigns?.find((campaign) => campaign.id === selectedCampaignId);

  return (
    <>
      <CreateUpdateCampaignModal
        open={modal === CampaignModal.CreateUpdate}
        onClose={() => {
          setModal(null);
          setTimeout(() => setSelectedCampaignId(null), 500);
        }}
        campaign={selectedCampaign}
      />

      <CampaignMembersModal
        open={modal === CampaignModal.Members}
        onClose={() => setModal(null)}
        campaign={selectedCampaign}
      />

      <PluginsModal open={modal === CampaignModal.Plugins} onClose={() => setModal(null)} campaign={selectedCampaign} />

      <ConfirmModal
        title="Delete Campaign"
        open={modal === CampaignModal.Delete}
        onConfirm={async () => {
          if (!selectedCampaign) return;
          await deleteCampaign(selectedCampaign.id);
        }}
        onClose={() => {
          setModal(null);
          setTimeout(() => setSelectedCampaignId(null), 500);
        }}
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
