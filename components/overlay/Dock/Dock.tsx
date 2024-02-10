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
  SvgIcon,
  Tooltip,
  alpha,
} from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import NextLink from 'next/link';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { signOut } from '@/actions/auth';
import { UserAvatar } from '@/components/common/UserAvatar';
import { SettingsModal } from '@/components/dashboard/SettingsModal';
import { useGetProfile } from '@/hooks/data/auth/useGetProfile';
import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { Color } from '@/lib/colors';
import { AppNavigation, ExternalNavigation } from '@/lib/navigation';
import campaignIcon from '@/public/images/app-icons/campaign.svg';
import discordIcon from '@/public/images/app-icons/discord.svg';
import { DashboardModal, useDashboardStore } from '@/store/dashboard';
import { HotkeysUtils } from '@/utils/HotkeyUtils';

import { DiceRoller } from './DiceRoller/DiceRoller';
import { DockButton } from './DockButton';
import { Plugins } from './Plugins';
import { ShortcutsModal } from './ShortcutsModal';

export function Dock() {
  const { data: user } = useGetUser();
  const { data: profile } = useGetProfile();

  const { modal, setModal } = useDashboardStore();

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

      <DiceRoller />

      <Box sx={{ display: 'flex', flex: '1 0 auto' }} />

      {user && (
        <Tooltip title="Dashboard">
          <NextLink href={AppNavigation.Dashboard} passHref>
            <DockButton>
              <SvgIcon component={campaignIcon} sx={{ fontSize: '2rem' }} />
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
                    <SvgIcon component={discordIcon} />
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
                <UserAvatar profile={profile} />
              </IconButton>
            </Tooltip>

            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <ListItem sx={{ mt: 1 }}>
                <ListItemAvatar>
                  <UserAvatar profile={profile} />
                </ListItemAvatar>
                <ListItemText primary={profile?.display_name || 'Guest'} />
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
                    <MenuItem component="button" type="submit" onClick={() => popupState.close()}>
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
            </Popover>
          </>
        )}
      </PopupState>

      <ShortcutsModal open={shortcutsModalOpen} onClose={() => setShortcutsModalOpen(false)} />

      <SettingsModal open={modal === DashboardModal.Settings} onClose={() => setModal(null)} />
    </Box>
  );
}
