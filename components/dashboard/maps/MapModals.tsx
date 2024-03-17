'use client';

import { useCampaignStore } from '@/store/useCampaignStore';
import { MapModal, useMapStore } from '@/store/useMapStore';

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
        <CreateUpdateMapModal open onClose={handleCloseModal} mapId={selectedMapId!} campaignId={selectedCampaignId!} />
      )}

      {modal === MapModal.Share && <ShareMapModal open onClose={handleCloseModal} mapId={selectedMapId!} />}

      {modal === MapModal.Delete && <DeleteMapModal open onClose={handleCloseModal} mapId={selectedMapId!} />}
    </>
  );
}
