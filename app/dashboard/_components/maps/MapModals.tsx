'use client';

import { useCampaignStore } from '@/store/campaign';
import { MapModal, useMapStore } from '@/store/map';

import { CreateUpdateMapModal } from './CreateUpdateMapModal';
import { DeleteMapModal } from './DeleteMapModal';
import { ShareMapModal } from './ShareMapModal';

export function MapModals() {
  const selectedCampaignId = useCampaignStore((state) => state.selectedCampaignId);
  const setSelectedCampaignId = useCampaignStore((state) => state.setSelectedCampaignId);
  const selectedMapId = useMapStore((state) => state.selectedMapId);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);
  const modal = useMapStore((state) => state.modal);
  const setModal = useMapStore((state) => state.setModal);

  /**
   * Close the modal and reset the selected campaign and map
   */
  function handleCloseModal() {
    setModal(null);
    setTimeout(() => {
      setSelectedMapId(null);
      setSelectedCampaignId(null);
    }, 100);
  }

  return (
    <>
      {modal === MapModal.CreateUpdate && (
        <CreateUpdateMapModal
          open={modal === MapModal.CreateUpdate}
          onClose={handleCloseModal}
          mapId={selectedMapId!}
          campaignId={selectedCampaignId!}
        />
      )}

      {modal === MapModal.Share && (
        <ShareMapModal open={modal === MapModal.Share} onClose={handleCloseModal} mapId={selectedMapId!} />
      )}

      {modal === MapModal.Delete && (
        <DeleteMapModal open={modal === MapModal.Delete} onClose={handleCloseModal} mapId={selectedMapId!} />
      )}
    </>
  );
}
