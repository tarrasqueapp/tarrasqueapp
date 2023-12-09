import { Check, Close } from '@mui/icons-material';
import { IconButton, ListItem, ListItemText } from '@mui/material';

import { useAcceptInvite } from '@/hooks/data/notifications/useAcceptInvite';
import { useDeclineInvite } from '@/hooks/data/notifications/useDeclineInvite';
import { ActionTokenEntity } from '@/lib/types';

export function CampaignInviteNotification(invite: ActionTokenEntity) {
  const acceptCampaignInvite = useAcceptInvite();
  const declineCampaignInvite = useDeclineInvite();

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
}
