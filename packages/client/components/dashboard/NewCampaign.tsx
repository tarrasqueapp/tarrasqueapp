import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';

export const NewCampaign: React.FC = () => {
  return (
    <Button
      onClick={() => {
        store.campaigns.setSelectedCampaign(null);
        store.campaigns.setModal(CampaignModal.CreateUpdate);
      }}
      sx={{
        height: 300,
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Add />
      New Campaign
    </Button>
  );
};
