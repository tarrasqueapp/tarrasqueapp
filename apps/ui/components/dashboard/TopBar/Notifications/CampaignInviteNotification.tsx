import { Check, Close } from '@mui/icons-material';
import { IconButton, ListItem, ListItemText } from '@mui/material';

import { useAcceptCampaignInvite } from '../../../../hooks/data/campaigns/invites/useAcceptCampaignInvite';
import { useDeclineCampaignInvite } from '../../../../hooks/data/campaigns/invites/useDeclineCampaignInvite';
import { CampaignInviteInterface } from '../../../../lib/types';

export const CampaignInviteNotification: React.FC<CampaignInviteInterface> = (invite) => {
  const acceptCampaignInvite = useAcceptCampaignInvite();
  const declineCampaignInvite = useDeclineCampaignInvite();

  return (
    <ListItem
      sx={{ pr: 9 }}
      disableGutters
      secondaryAction={
        <>
          <IconButton size="small" onClick={() => acceptCampaignInvite.mutateAsync(invite)}>
            <Check />
          </IconButton>

          <IconButton size="small" onClick={() => declineCampaignInvite.mutateAsync(invite)}>
            <Close />
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={
          <>
            You have been invited to join &quot;<strong>{invite.campaign?.name}</strong>&quot;
          </>
        }
      />
    </ListItem>
  );
};
