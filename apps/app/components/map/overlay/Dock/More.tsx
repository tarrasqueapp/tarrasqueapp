import {
  Announcement,
  AttachMoney,
  HelpCenter,
  Keyboard,
  MoreHoriz,
  NewReleases,
  Storefront,
} from '@mui/icons-material';
import {
  Chip,
  Divider,
  Fade,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  SvgIcon,
  Tooltip,
} from '@mui/material';
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import discordIcon from '@/public/images/app-icons/discord.svg';
import { HotkeysUtils } from '@/utils/helpers/hotkeys';
import { ExternalNavigation } from '@/utils/navigation';

import { DockButton } from './DockButton';
import { ShortcutsModal } from './ShortcutsModal';

export function More() {
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Register hotkey
  useHotkeys(HotkeysUtils.Shortcuts, () => setShortcutsModalOpen((shortcutsModalOpen) => !shortcutsModalOpen), [
    shortcutsModalOpen,
  ]);

  return (
    <PopupState variant="popper" popupId="more">
      {(popupState) => (
        <>
          <Tooltip title="More">
            <DockButton {...bindToggle(popupState)} active={popupState.isOpen}>
              <MoreHoriz sx={{ fontSize: '2rem' }} />
            </DockButton>
          </Tooltip>

          <Popper {...bindPopper(popupState)} transition disablePortal>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper sx={{ m: 2, mr: 1 }}>
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
                </Paper>
              </Fade>
            )}
          </Popper>

          {shortcutsModalOpen && <ShortcutsModal open onClose={() => setShortcutsModalOpen(false)} />}
        </>
      )}
    </PopupState>
  );
}
