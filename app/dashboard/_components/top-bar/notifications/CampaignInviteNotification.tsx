import { Check, Close } from '@mui/icons-material';
import { IconButton, ListItem, ListItemText } from '@mui/material';

import { Invite, acceptInvite, deleteInvite } from '@/actions/invites';

export function CampaignInviteNotification({ invite }: { invite: Invite }) {
  return (
    <ListItem
      sx={{ pr: 9 }}
      disableGutters
      secondaryAction={
        <>
          <IconButton size="small" onClick={() => acceptInvite(invite.id)}>
            <Check />
          </IconButton>

          <IconButton size="small" onClick={() => deleteInvite(invite.id)}>
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
