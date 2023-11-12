import { Alert } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useDeleteCampaign } from '../../hooks/data/campaigns/useDeleteCampaign';
import { useGetUserCampaigns } from '../../hooks/data/campaigns/useGetUserCampaigns';
import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';
import { ConfirmModal } from '../common/ConfirmModal';
import { CampaignMembersModal } from './CampaignMembersModal';
import { CreateUpdateCampaignModal } from './CreateUpdateCampaignModal';

export const CampaignModals = observer(function CampaignModals() {
  const { data: campaigns } = useGetUserCampaigns();
  const deleteCampaign = useDeleteCampaign();

  const selectedCampaign = campaigns?.find((campaign) => campaign.id === store.campaigns.selectedCampaignId);

  return (
    <>
      <CreateUpdateCampaignModal
        open={store.campaigns.modal === CampaignModal.CreateUpdate}
        onClose={() => {
          store.campaigns.setModal(null);
          setTimeout(() => store.campaigns.setSelectedCampaignId(null), 500);
        }}
        campaign={selectedCampaign}
      />

      <CampaignMembersModal
        open={store.campaigns.modal === CampaignModal.Members}
        onClose={() => store.campaigns.setModal(null)}
        campaign={selectedCampaign}
      />

      <ConfirmModal
        title="Delete Campaign"
        open={store.campaigns.modal === CampaignModal.Delete}
        onConfirm={async () => {
          if (!selectedCampaign) return;
          deleteCampaign.mutate(selectedCampaign);
        }}
        onClose={() => {
          store.campaigns.setModal(null);
          setTimeout(() => store.campaigns.setSelectedCampaignId(null), 500);
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
});
