import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { CampaignEntity } from '@tarrasque/sdk';

import { Color } from '../../lib/colors';
import { store } from '../../store';
import { MapModal } from '../../store/maps';

interface NewMapProps {
  campaign: CampaignEntity | null;
}

export function NewMap({ campaign }: NewMapProps) {
  return (
    <Button
      disabled={!campaign}
      onClick={() => {
        if (!campaign) return;
        store.campaigns.setSelectedCampaignId(campaign.id);
        store.maps.setModal(MapModal.CreateUpdate);
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
