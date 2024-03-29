import { Login, Logout, Settings } from '@mui/icons-material';
import {
  Fade,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
} from '@mui/material';
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';
import NextLink from 'next/link';

import { signOut } from '@/actions/auth';
import { SettingsModal } from '@/components/account/SettingsModal';
import { UserAvatar } from '@/components/account/UserAvatar';
import { useGetProfile } from '@/hooks/data/auth/useGetProfile';
import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { DashboardModal, useDashboardStore } from '@/store/useDashboardStore';
import { AppNavigation } from '@/utils/navigation';

export function DockAccount() {
  const { data: user } = useGetUser();
  const { data: profile } = useGetProfile();

  const modal = useDashboardStore((state) => state.modal);
  const setModal = useDashboardStore((state) => state.setModal);

  return (
    <PopupState variant="popper" popupId="account">
      {(popupState) => (
        <>
          <Tooltip title="Account">
            <IconButton {...bindToggle(popupState)} size="small">
              <UserAvatar profile={profile} />
            </IconButton>
          </Tooltip>

          <Popper {...bindPopper(popupState)} transition disablePortal>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper sx={{ m: 2, ml: 1 }}>
                  <ListItem sx={{ mt: 1 }}>
                    <ListItemAvatar>
                      <UserAvatar profile={profile} />
                    </ListItemAvatar>
                    <ListItemText primary={profile?.name || 'Guest'} />
                  </ListItem>

                  {user ? (
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
                        <MenuItem
                          component="button"
                          type="submit"
                          onClick={() => popupState.close()}
                          sx={{ width: '100%', textAlign: 'left' }}
                        >
                          <ListItemIcon>
                            <Logout />
                          </ListItemIcon>
                          <ListItemText primary="Sign out" />
                        </MenuItem>
                      </form>
                    </MenuList>
                  ) : (
                    <MenuList>
                      <NextLink href={AppNavigation.SignIn} passHref legacyBehavior>
                        <MenuItem component="a" onClick={() => popupState.close()}>
                          <ListItemIcon>
                            <Login />
                          </ListItemIcon>
                          <ListItemText primary="Sign in" />
                        </MenuItem>
                      </NextLink>
                    </MenuList>
                  )}
                </Paper>
              </Fade>
            )}
          </Popper>

          {modal === DashboardModal.Settings && <SettingsModal open onClose={() => setModal(null)} />}
        </>
      )}
    </PopupState>
  );
}
