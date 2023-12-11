import { Extension } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { Campaign } from '@/actions/campaigns';
import { CampaignModal, useCampaignStore } from '@/store/campaign';

interface Props {
  campaign?: Campaign;
}

export function Plugins({ campaign }: Props) {
  const { setModal, setSelectedCampaignId } = useCampaignStore();

  return (
    <Tooltip title="Plugins">
      <IconButton
        onClick={() => {
          setSelectedCampaignId(campaign?.id || '');
          setModal(CampaignModal.Plugins);
        }}
      >
        <Extension />
      </IconButton>
    </Tooltip>
  );
}
