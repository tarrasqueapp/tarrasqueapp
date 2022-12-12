import { Add } from '@mui/icons-material';
import { Button, Paper } from '@mui/material';

import { Color } from '../../lib/colors';
import { CampaignInterface } from '../../lib/types';
import { store } from '../../store';
import { MapModal } from '../../store/maps';

interface IMapNewProps {
  campaign: CampaignInterface | null;
}

export const MapNew: React.FC<IMapNewProps> = ({ campaign }) => {
  const borderColor = Color.BrownDark;
  const spacing = '20px';
  const dashLength = '30px';
  const borderWidth = '2px';

  return (
    <Paper
      sx={{
        width: 250,
        height: 200,
        display: 'flex',
        backgroundImage: `repeating-linear-gradient(0deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength}), repeating-linear-gradient(90deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength}), repeating-linear-gradient(180deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength}), repeating-linear-gradient(270deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength})`,
        backgroundSize: `${borderWidth} 100%, 100% ${borderWidth}, ${borderWidth} 100%, 100% ${borderWidth}`,
        backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Button
        disabled={!campaign}
        onClick={() => {
          store.campaigns.setSelectedCampaign(campaign);
          store.maps.setModal(MapModal.AddEdit);
        }}
        sx={{
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
