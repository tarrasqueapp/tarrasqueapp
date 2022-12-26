import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { Color } from '../../lib/colors';
import { CampaignInterface } from '../../lib/types';
import { store } from '../../store';
import { MapModal } from '../../store/maps';

interface NewMapProps {
  campaign: CampaignInterface | null;
}

export const NewMap: React.FC<NewMapProps> = ({ campaign }) => {
  return (
    <Button
      disabled={!campaign}
      onClick={() => {
        store.campaigns.setSelectedCampaign(campaign);
        store.maps.setModal(MapModal.CreateUpdate);
      }}
      sx={{
        border: `3px dashed ${Color.BrownDark}`,
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
};
