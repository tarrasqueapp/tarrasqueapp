import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { CampaignModal, useCampaignStore } from '@/store/useCampaignStore';

export function NewCampaign() {
  const setSelectedCampaignId = useCampaignStore((state) => state.setSelectedCampaignId);
  const setModal = useCampaignStore((state) => state.setModal);

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
