import { Extension } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { CampaignEntity } from '../../../lib/types';
import { store } from '../../../store';
import { CampaignModal } from '../../../store/campaigns';

interface Props {
  campaign?: CampaignEntity;
}

export function Plugins({ campaign }: Props) {
  return (
    <Tooltip title="Plugins">
      <IconButton
        onClick={() => {
          store.campaigns.setSelectedCampaignId(campaign?.id || '');
          store.campaigns.setModal(CampaignModal.Plugins);
        }}
      >
        <Extension />
      </IconButton>
    </Tooltip>
  );
}
