import {
  Announcement,
  AttachMoney,
  HelpCenter,
  Keyboard,
  Login,
  Logout,
  MoreHoriz,
  NewReleases,
  Settings,
  Storefront,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Tooltip,
  alpha,
} from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { observer } from 'mobx-react-lite';
import NextLink from 'next/link';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useGetUser } from '../../../hooks/data/auth/useGetUser';
import { Color } from '../../../lib/colors';
import { AppNavigation, ExternalNavigation } from '../../../lib/navigation';
import { store } from '../../../store';
import { HotkeysUtils } from '../../../utils/HotkeyUtils';
import { SettingsModal } from '../../dashboard/SettingsModal';
import { CampaignIcon } from '../../icons/CampaignIcon';
import { DiscordIcon } from '../../icons/DiscordIcon';
import { DockButton } from './DockButton';
import { Plugins } from './Plugins';
import { ShortcutsModal } from './ShortcutsModal';

export const Dock = observer(function Dock() {
  const { data: user } = useGetUser();

  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Register hotkey
  useHotkeys(HotkeysUtils.Shortcuts, () => setShortcutsModalOpen((shortcutsModalOpen) => !shortcutsModalOpen), [
    shortcutsModalOpen,
  ]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: alpha(Color.BLACK_LIGHT, 0.9),
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        p: 1,
        gap: 1,
      }}
    >
      <Plugins />

      <Box sx={{ display: 'flex', flex: '1 0 auto' }} />

      {user && (
        <Tooltip title="Dashboard">
          <NextLink href={AppNavigation.Dashboard} passHref>
            <DockButton>
              <CampaignIcon sx={{ fontSize: '2rem' }} />
            </DockButton>
          </NextLink>
        </Tooltip>
      )}

      <PopupState variant="popover" popupId="more">
        {(popupState) => (
          <>
            <Tooltip title="More">
              <DockButton {...bindTrigger(popupState)} active={popupState.isOpen}>
                <MoreHoriz sx={{ fontSize: '2rem' }} />
              </DockButton>
            </Tooltip>

            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <MenuList>
                <MenuItem
                  onClick={() => popupState.close()}
                  component="a"
                  href={ExternalNavigation.Changelog}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <Announcement />
                  </ListItemIcon>
                  <ListItemText primary="Changelog" secondary="Check out the latest update" />
                </MenuItem>

                <MenuItem
                  onClick={() => popupState.close()}
                  component="a"
                  href={ExternalNavigation.Roadmap}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <NewReleases />
                  </ListItemIcon>
                  <ListItemText primary="Roadmap" secondary="See what's coming next" />
                </MenuItem>

                <MenuItem
                  onClick={() => popupState.close()}
                  component="a"
                  href={ExternalNavigation.Docs}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <HelpCenter />
                  </ListItemIcon>
                  <ListItemText primary="Documentation" secondary="Guides and tutorials" />
                </MenuItem>

                <MenuItem
                  onClick={() => popupState.close()}
                  component="a"
                  href={ExternalNavigation.Shop}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <Storefront />
                  </ListItemIcon>
                  <ListItemText primary="Shop" secondary="Buy Tarrasque merch" />
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={() => popupState.close()}
                  component="a"
                  href={ExternalNavigation.Discord}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <DiscordIcon />
                  </ListItemIcon>
                  <ListItemText primary="Discord" secondary="Join our community" />
                </MenuItem>

                <MenuItem
                  onClick={() => popupState.close()}
                  component="a"
                  href={ExternalNavigation.Donate}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>
                    <AttachMoney />
                  </ListItemIcon>
                  <ListItemText primary="Donate" secondary="Support the project" />
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={() => {
                    setShortcutsModalOpen(true);
                    popupState.close();
                  }}
                >
                  <ListItemIcon>
                    <Keyboard />
                  </ListItemIcon>
                  <ListItemText primary="Shortcuts" />
                  <Chip label={HotkeysUtils.Shortcuts} size="small" sx={{ ml: 1 }} />
                </MenuItem>
              </MenuList>
            </Popover>
          </>
        )}
      </PopupState>

      <PopupState variant="popover" popupId="account">
        {(popupState) => (
          <>
            <Tooltip title="Account">
              <IconButton {...bindTrigger(popupState)} size="small">
                <Avatar src={user?.avatar?.thumbnail_url}>{user?.display_name[0]}</Avatar>
              </IconButton>
            </Tooltip>

            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <ListItem sx={{ mt: 1 }}>
                <ListItemAvatar>
                  <Avatar src={user?.avatar?.thumbnail_url}>{user?.display_name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user?.name || 'Guest'} />
              </ListItem>

              {user ? (
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
                    <MenuItem component="a" onClick={() => popupState.close()}>
                      <ListItemIcon>
                        <Logout />
                      </ListItemIcon>
                      <ListItemText primary="Sign out" />
                    </MenuItem>
                  </NextLink>
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
            </Popover>
          </>
        )}
      </PopupState>

      <ShortcutsModal open={shortcutsModalOpen} onClose={() => setShortcutsModalOpen(false)} />

      <SettingsModal
        open={store.dashboard.settingsModalOpen}
        onClose={() => store.dashboard.toggleSettingsModal(false)}
        user={user}
      />
    </Box>
  );
});
