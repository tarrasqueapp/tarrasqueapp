import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { Badge, Box, IconButton, List, Popover, Tooltip, Typography } from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

import { InviteNotificationEntity, NotificationTypeEnum } from '@tarrasque/common';

import { useGetNotifications } from '../../../../hooks/data/notifications/useGetNotifications';
import { CampaignInviteNotification } from './CampaignInviteNotification';

export function Notifications() {
  const { data: notifications } = useGetNotifications();

  return (
    <>
      <PopupState variant="popover" popupId={`notifications`}>
        {(popupState) => (
          <>
            <Tooltip title="Notifications">
              <IconButton {...bindTrigger(popupState)}>
                <Badge badgeContent={notifications?.length} color="info">
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

                {notifications && notifications.length > 0 ? (
                  <List disablePadding dense>
                    {notifications
                      .filter(
                        (notification): notification is InviteNotificationEntity =>
                          notification.type === NotificationTypeEnum.INVITE,
                      )
                      .map((notification) => (
                        <CampaignInviteNotification key={notification.data.id} {...notification.data} />
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
