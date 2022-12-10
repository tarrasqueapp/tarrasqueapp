import { observer } from 'mobx-react-lite';

import { useDeleteMap } from '../../hooks/data/maps/useDeleteMap';
import { store } from '../../store';
import { MapModal } from '../../store/maps';
import { ConfirmModal } from '../common/ConfirmModal';
import { AddEditMapModal } from './AddEditMapModal';

export const MapModals: React.FC = observer(() => {
  const deleteMap = useDeleteMap();

  return (
    <>
      <AddEditMapModal
        open={store.maps.modal === MapModal.AddEdit}
        onClose={() => {
          store.maps.setModal(null);
          setTimeout(() => {
            store.maps.setSelectedMap(null);
            store.campaigns.setSelectedCampaign(null);
          }, 100);
        }}
        map={store.maps.selectedMap}
        campaign={store.campaigns.selectedCampaign}
      />

      <ConfirmModal
        open={store.maps.modal === MapModal.Remove}
        onConfirm={async () => {
          if (!store.maps.selectedMap) return;
          await deleteMap.mutateAsync(store.maps.selectedMap);
        }}
        onClose={() => {
          store.maps.setModal(null);
          setTimeout(() => {
            store.maps.setSelectedMap(null);
            store.campaigns.setSelectedCampaign(null);
          }, 100);
        }}
      />
    </>
  );
});
