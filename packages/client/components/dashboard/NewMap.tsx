import { Add } from '@mui/icons-material';
import { Button, Paper } from '@mui/material';

import { Color } from '../../lib/colors';
import { CampaignInterface } from '../../lib/types';
import { store } from '../../store';
import { MapModal } from '../../store/maps';

interface NewMapProps {
  campaign: CampaignInterface | null;
}

export const NewMap: React.FC<NewMapProps> = ({ campaign }) => {
  return (
    <Paper
      sx={{
        width: 250,
        height: 200,
        display: 'flex',
        background: 'transparent',
        border: `3px dashed ${Color.BrownDark}`,
      }}
    >
      <Button
        disabled={!campaign}
        onClick={() => {
          store.campaigns.setSelectedCampaign(campaign);
          store.maps.setModal(MapModal.CreateUpdate);
        }}
        sx={{
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1 0 auto',
          gap: 1,
        }}
      >
        <Add />
        New Map
      </Button>
    </Paper>
  );
};
