import { Logout, Settings } from '@mui/icons-material';
import { Avatar, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Popover, Tooltip } from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';

import { signOut } from '../../../../app/auth/actions';
import { useGetProfile } from '../../../../hooks/data/auth/useGetProfile';
import { storageImageLoader } from '../../../../lib/storageImageLoader';
import { store } from '../../../../store';
import { SettingsModal } from '../../SettingsModal';

export const Account = observer(function Account() {
  const { data: profile } = useGetProfile();

  return (
    <>
      <PopupState variant="popover" popupId="profile">
        {(popupState) => (
          <>
            <Tooltip title="Account">
              <IconButton {...bindTrigger(popupState)}>
                <Avatar>
                  {profile?.avatar?.url ? (
                    <Image loader={storageImageLoader} src={profile.avatar.url} width={40} height={40} alt="" />
                  ) : (
                    profile?.display_name[0]
                  )}
                </Avatar>
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

                <form action={signOut}>
                  <MenuItem component="button" type="submit">
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Sign out" />
                  </MenuItem>
                </form>
              </MenuList>
            </Popover>
          </>
        )}
      </PopupState>

      <SettingsModal
        open={store.dashboard.settingsModalOpen}
        onClose={() => store.dashboard.toggleSettingsModal(false)}
      />
    </>
  );
});
