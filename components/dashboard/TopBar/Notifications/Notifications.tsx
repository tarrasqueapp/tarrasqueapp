'use client';

import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { Badge, Box, IconButton, List, Popover, Tooltip, Typography } from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

import { useGetUserInvites } from '@/hooks/data/notifications/useGetUserInvites';

import { CampaignInviteNotification } from './CampaignInviteNotification';

export function Notifications() {
  const { data: invites } = useGetUserInvites();

  return (
    <>
      <PopupState variant="popover" popupId={`invites`}>
        {(popupState) => (
          <>
            <Tooltip title="Notifications">
              <IconButton {...bindTrigger(popupState)}>
                <Badge badgeContent={invites?.length} color="info">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Box sx={{ p: 2, width: 300 }}>
                <Typography variant="h5" paragraph>
                  Notifications
                </Typography>

                {invites && invites.length > 0 ? (
                  <List disablePadding dense>
                    {invites.map((invite) => (
                      <CampaignInviteNotification key={invite.id} invite={invite} />
                    ))}
                  </List>
                ) : (
                  <Typography align="center" sx={{ p: 2 }}>
                    All caught up! 🎉
                  </Typography>
                )}
              </Box>
            </Popover>
          </>
        )}
      </PopupState>
    </>
  );
}
