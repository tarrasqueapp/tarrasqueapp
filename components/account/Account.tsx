'use client';

import { Logout, Settings } from '@mui/icons-material';
import { IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Popover, Tooltip } from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

import { signOut } from '@/actions/auth';
import { UserAvatar } from '@/components/UserAvatar';
import { useGetProfile } from '@/hooks/data/auth/useGetProfile';
import { DashboardModal, useDashboardStore } from '@/store/dashboard';

import { SettingsModal } from './SettingsModal';

export function Account() {
  const { data: profile } = useGetProfile();

  const modal = useDashboardStore((state) => state.modal);
  const setModal = useDashboardStore((state) => state.setModal);

  return (
    <>
      <PopupState variant="popover" popupId="profile">
        {(popupState) => (
          <>
            <Tooltip title="Account">
              <IconButton {...bindTrigger(popupState)}>
                <UserAvatar profile={profile} />
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
                    setModal(DashboardModal.Settings);
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

      <SettingsModal open={modal === DashboardModal.Settings} onClose={() => setModal(null)} />
    </>
  );
}
