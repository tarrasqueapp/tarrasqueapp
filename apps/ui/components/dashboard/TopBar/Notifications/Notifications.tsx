import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { Badge, Box, IconButton, List, Popover, Tooltip, Typography } from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

import { useGetNotifications } from '../../../../hooks/data/users/notifications/useGetNotifications';
import { CampaignInviteNotification } from './CampaignInviteNotification';

export const Notifications: React.FC = () => {
  const { data: notifications } = useGetNotifications();

  return (
    <>
      <PopupState variant="popover" popupId={`notifications`}>
        {(popupState) => (
          <>
            <Tooltip title="Notifications">
              <IconButton {...bindTrigger(popupState)}>
                <Badge badgeContent={notifications?.campaignInvites.length} color="info">
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

                {Boolean(notifications?.campaignInvites.length) ? (
                  <List disablePadding dense>
                    {notifications?.campaignInvites.map((invite) => (
                      <CampaignInviteNotification key={invite.id} {...invite} />
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
};
