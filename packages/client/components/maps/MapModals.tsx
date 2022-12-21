import { Alert } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { useDeleteMap } from '../../hooks/data/maps/useDeleteMap';
import { store } from '../../store';
import { MapModal } from '../../store/maps';
import { ConfirmModal } from '../common/ConfirmModal';
import { CreateUpdateMapModal } from './CreateUpdateMapModal';

export const MapModals: React.FC = observer(() => {
  const deleteMap = useDeleteMap();

  return (
    <>
      <CreateUpdateMapModal
        open={store.maps.modal === MapModal.CreateUpdate}
        onClose={() => {
          store.maps.setModal(null);
          setTimeout(() => {
            store.maps.setSelectedMap(null);
            store.campaigns.setSelectedCampaign(null);
          }, 500);
        }}
        map={store.maps.selectedMap}
        campaign={store.campaigns.selectedCampaign}
      />

      <ConfirmModal
        title="Delete Map"
        open={store.maps.modal === MapModal.Delete}
        onConfirm={async () => {
          if (!store.maps.selectedMap) return;
          await deleteMap.mutateAsync(store.maps.selectedMap);
        }}
        onClose={() => {
          store.maps.setModal(null);
          setTimeout(() => {
            store.maps.setSelectedMap(null);
            store.campaigns.setSelectedCampaign(null);
          }, 500);
        }}
      >
        <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        You&apos;re about to delete the map &quot;<strong>{store.maps.selectedMap?.name}</strong>&quot;.{' '}
      </ConfirmModal>
    </>
  );
});
