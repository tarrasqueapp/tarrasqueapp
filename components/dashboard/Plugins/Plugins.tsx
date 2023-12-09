import { Extension } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { CampaignEntity } from '@/lib/types';
import { CampaignModal, useCampaignStore } from '@/store/campaign';

interface Props {
  campaign?: CampaignEntity;
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
