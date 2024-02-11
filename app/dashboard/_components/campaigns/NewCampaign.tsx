import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { CampaignModal, useCampaignStore } from '@/store/campaign';

export function NewCampaign() {
  const { setSelectedCampaignId, setModal } = useCampaignStore();

  return (
    <Button
      onClick={() => {
        setSelectedCampaignId(null);
        setModal(CampaignModal.CreateUpdate);
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
