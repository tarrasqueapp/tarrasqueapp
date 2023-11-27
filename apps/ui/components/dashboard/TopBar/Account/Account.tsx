import { Logout, Settings } from '@mui/icons-material';
import { Avatar, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Popover, Tooltip } from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { observer } from 'mobx-react-lite';
import NextLink from 'next/link';

import { useGetUser } from '../../../../hooks/data/auth/useGetUser';
import { AppNavigation } from '../../../../lib/navigation';
import { store } from '../../../../store';
import { SettingsModal } from '../../SettingsModal';

export const Account = observer(function Account() {
  const { data: user } = useGetUser();

  return (
    <>
      <PopupState variant="popover" popupId={`user`}>
        {(popupState) => (
          <>
            <Tooltip title="Account">
              <IconButton {...bindTrigger(popupState)}>
                <Avatar src={user?.avatar?.thumbnailUrl}>{user?.displayName[0]}</Avatar>
              </IconButton>
            </Tooltip>

            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <MenuList>
                <MenuItem
                  onClick={() => {
                    store.dashboard.toggleSettingsModal();
                    popupState.close();
                  }}
                >
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </MenuItem>

                <NextLink href={AppNavigation.SignOut} passHref legacyBehavior>
                  <MenuItem>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Sign out" />
                  </MenuItem>
                </NextLink>
              </MenuList>
            </Popover>
          </>
        )}
      </PopupState>

      <SettingsModal
        open={store.dashboard.settingsModalOpen}
        onClose={() => store.dashboard.toggleSettingsModal(false)}
        user={user}
      />
    </>
  );
});
