import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { Color } from '@/lib/colors';
import { CampaignEntity } from '@/lib/types';
import { useCampaignStore } from '@/store/campaign';
import { MapModal, useMapStore } from '@/store/map';

interface NewMapProps {
  campaign: CampaignEntity | null;
}

export function NewMap({ campaign }: NewMapProps) {
  const { setSelectedCampaignId } = useCampaignStore();
  const { setModal } = useMapStore();

  return (
    <Button
      disabled={!campaign}
      onClick={() => {
        if (!campaign) return;
        setSelectedCampaignId(campaign.id);
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
