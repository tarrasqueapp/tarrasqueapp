import { Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useDeleteCampaign } from '../../hooks/data/campaigns/useDeleteCampaign';
import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';
import { ConfirmModal } from '../common/ConfirmModal';
import { CreateUpdateCampaignModal } from './CreateUpdateCampaignModal';

export const CampaignModals: React.FC = observer(() => {
  const deleteCampaign = useDeleteCampaign();

  return (
    <>
      <CreateUpdateCampaignModal
        open={store.campaigns.modal === CampaignModal.CreateUpdate}
        onClose={() => {
          store.campaigns.setModal(null);
          setTimeout(() => store.campaigns.setSelectedCampaign(null), 100);
        }}
        campaign={store.campaigns.selectedCampaign}
      />

      <ConfirmModal
        title="Delete Campaign"
        open={store.campaigns.modal === CampaignModal.Delete}
        onConfirm={async () => {
          if (!store.campaigns.selectedCampaign) return;
          await deleteCampaign.mutateAsync(store.campaigns.selectedCampaign);
        }}
        onClose={() => {
          store.campaigns.setModal(null);
          setTimeout(() => store.campaigns.setSelectedCampaign(null), 100);
        }}
      >
        You&apos;re about to delete the campaign &quot;<strong>{store.campaigns.selectedCampaign?.name}</strong>&quot;
        and all of its maps, characters, and associated data.{' '}
        <Typography color="error" component="span">
          This cannot be undone.
        </Typography>
      </ConfirmModal>
    </>
  );
});