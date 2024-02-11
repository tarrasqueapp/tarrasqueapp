'use client';

import { Alert } from '@mui/material';

import { deleteMap } from '@/actions/maps';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useGetUserCampaigns } from '@/hooks/data/campaigns/useGetUserCampaigns';
import { useGetCampaignMaps } from '@/hooks/data/maps/useGetCampaignMaps';
import { useCampaignStore } from '@/store/campaign';
import { MapModal, useMapStore } from '@/store/map';

import { CreateUpdateMapModal } from './CreateUpdateMapModal';

export function MapModals() {
  const { selectedCampaignId, setSelectedCampaignId } = useCampaignStore();
  const { selectedMapId, setSelectedMapId, modal, setModal } = useMapStore();
  const { data: campaigns } = useGetUserCampaigns();
  const { data: maps } = useGetCampaignMaps(selectedCampaignId!);

  const selectedCampaign = campaigns?.find((campaign) => campaign.id === selectedCampaignId);
  const selectedMap = maps?.find((map) => map.id === selectedMapId);

  /**
   * Close the modal and reset the selected campaign and map
   */
  function handleCloseModal() {
    setModal(null);
    setTimeout(() => {
      setSelectedMapId(null);
      setSelectedCampaignId(null);
    }, 500);
  }

  return (
    <>
      <CreateUpdateMapModal
        open={modal === MapModal.CreateUpdate}
        onClose={handleCloseModal}
        map={selectedMap}
        campaign={selectedCampaign}
      />

      <ConfirmModal
        title="Delete Map"
        open={modal === MapModal.Delete}
        onConfirm={async () => {
          if (!selectedMap) return;
          deleteMap(selectedMap.id);
        }}
        onClose={handleCloseModal}
      >
        <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        You&apos;re about to delete the map &quot;<strong>{selectedMap?.name}</strong>&quot;.{' '}
      </ConfirmModal>
    </>
  );
}
