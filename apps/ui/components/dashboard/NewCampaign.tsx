import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';

export function NewCampaign() {
  return (
    <Button
      onClick={() => {
        store.campaigns.setSelectedCampaignId(null);
        store.campaigns.setModal(CampaignModal.CreateUpdate);
      }}
      sx={{
        height: 200,
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
}
