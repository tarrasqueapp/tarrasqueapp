import { Logout, Settings } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import NextLink from 'next/link';

import { useGetUser } from '../../../hooks/data/users/useGetUser';
import { AppNavigation } from '../../../lib/navigation';
import { store } from '../../../store';
import { Logo } from '../../common/Logo';
import { Notifications } from './Notifications/Notifications';
import { Version } from './Version';

export const TopBar: React.FC = () => {
  const { data: user } = useGetUser();

  return (
    <AppBar
      position="static"
      sx={{
        background: 'transparent',
        border: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', pt: 2, pb: 1, gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Logo size={50} />

          <Typography variant="h6" color="primary.light">
            Tarrasque App
          </Typography>

          <Version />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Notifications />

          <PopupState variant="popover" popupId={`user`}>
            {(popupState) => (
              <>
                <Tooltip title="Account">
                  <IconButton {...bindTrigger(popupState)}>
                    <Avatar src={user?.avatar?.thumbnailUrl} />
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};
