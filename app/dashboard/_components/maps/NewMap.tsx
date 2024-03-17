import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { Color } from '@/lib/colors';
import { useCampaignStore } from '@/store/campaign';
import { MapModal, useMapStore } from '@/store/map';

interface NewMapProps {
  campaignId?: string;
}

export function NewMap({ campaignId }: NewMapProps) {
  const setSelectedCampaignId = useCampaignStore((state) => state.setSelectedCampaignId);
  const setModal = useMapStore((state) => state.setModal);

  return (
    <Button
      disabled={!campaignId}
      onClick={() => {
        if (!campaignId) return;
        setSelectedCampaignId(campaignId);
        setModal(MapModal.CreateUpdate);
      }}
      sx={{
        border: `3px dashed ${Color.BROWN_DARK}`,
        width: 250,
        height: 200,
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Add />
      New Map
    </Button>
  );
}
