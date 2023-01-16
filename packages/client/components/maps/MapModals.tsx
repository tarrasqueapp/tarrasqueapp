import { Alert } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useGetUserCampaigns } from '../../hooks/data/campaigns/useGetUserCampaigns';
import { useDeleteMap } from '../../hooks/data/maps/useDeleteMap';
import { useGetCampaignMaps } from '../../hooks/data/maps/useGetCampaignMaps';
import { store } from '../../store';
import { MapModal } from '../../store/maps';
import { ConfirmModal } from '../common/ConfirmModal';
import { CreateUpdateMapModal } from './CreateUpdateMapModal';

export const MapModals: React.FC = observer(() => {
  const { data: campaigns } = useGetUserCampaigns();
  const { data: maps } = useGetCampaignMaps(store.campaigns.selectedCampaignId || undefined);
  const deleteMap = useDeleteMap();

  const selectedCampaign = campaigns?.find((campaign) => campaign.id === store.campaigns.selectedCampaignId);
  const selectedMap = maps?.find((map) => map.id === store.maps.selectedMapId);

  return (
    <>
      <CreateUpdateMapModal
        open={store.maps.modal === MapModal.CreateUpdate}
        onClose={() => {
          store.maps.setModal(null);
          setTimeout(() => {
            store.maps.setSelectedMapId(null);
            store.campaigns.setSelectedCampaignId(null);
          }, 500);
        }}
        map={selectedMap}
        campaign={selectedCampaign}
      />

      <ConfirmModal
        title="Delete Map"
        open={store.maps.modal === MapModal.Delete}
        onConfirm={async () => {
          if (!selectedMap) return;
          deleteMap.mutate(selectedMap);
        }}
        onClose={() => {
          store.maps.setModal(null);
          setTimeout(() => {
            store.maps.setSelectedMapId(null);
            store.campaigns.setSelectedCampaignId(null);
          }, 500);
        }}
      >
        <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        You&apos;re about to delete the map &quot;<strong>{selectedMap?.name}</strong>&quot;.{' '}
      </ConfirmModal>
    </>
  );
});
