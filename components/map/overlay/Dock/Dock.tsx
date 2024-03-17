import { TableRows } from '@mui/icons-material';
import { Box, Tooltip, alpha } from '@mui/material';
import NextLink from 'next/link';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { Color } from '@/utils/colors';
import { HotkeysUtils } from '@/utils/helpers/hotkeys';
import { AppNavigation } from '@/utils/navigation';

import { DiceRoller } from './DiceRoller/DiceRoller';
import { DockAccount } from './DockAccount';
import { DockButton } from './DockButton';
import { More } from './More';
import { Plugins } from './Plugins/Plugins';

export function Dock() {
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

      <DiceRoller />

      <Box sx={{ display: 'flex', flex: '1 0 auto' }} />

      {user && (
        <Tooltip title="Dashboard">
          <NextLink href={AppNavigation.Dashboard} passHref>
            <DockButton>
              <TableRows sx={{ fontSize: '2rem' }} />
            </DockButton>
          </NextLink>
        </Tooltip>
      )}

      <More />

      <DockAccount />
    </Box>
  );
}
