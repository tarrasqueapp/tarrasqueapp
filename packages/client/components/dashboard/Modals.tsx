import { observer } from 'mobx-react-lite';

import { useDeleteCampaign } from '../../hooks/data/campaigns/useDeleteCampaign';
import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';
import { AddEditCampaignModal } from '../campaigns/AddEditCampaignModal';
import { ConfirmModal } from '../common/ConfirmModal';

export const Modals: React.FC = observer(() => {
  const deleteCampaign = useDeleteCampaign();

  return (
    <>
      <AddEditCampaignModal
        open={store.campaigns.modal === CampaignModal.AddEdit}
        onClose={() => {
          store.campaigns.setModal(null);
          setTimeout(() => store.campaigns.setSelectedCampaign(null), 100);
        }}
        campaign={store.campaigns.selectedCampaign}
      />

      <ConfirmModal
        open={store.campaigns.modal === CampaignModal.Remove}
        onConfirm={async () => {
          if (!store.campaigns.selectedCampaign) return;
          await deleteCampaign.mutateAsync(store.campaigns.selectedCampaign);
        }}
        onClose={() => {
          store.campaigns.setModal(null);
          setTimeout(() => store.campaigns.setSelectedCampaign(null), 100);
        }}
      />
    </>
  );
});
