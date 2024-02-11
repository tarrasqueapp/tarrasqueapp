import { AppBar, Box, Toolbar, Typography } from '@mui/material';

import { Account } from '@/components/Account/Account';
import { Logo } from '@/components/Logo';

import { Version } from './Version';
import { CompendiumButton } from './compendium/CompendiumButton';
import { NotificationsButton } from './notifications/NotificationsButton';
import { PluginsButton } from './plugins/PluginsButton';

export function TopBar() {
  return (
    <AppBar position="static" sx={{ background: 'transparent', border: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', pt: 2, pb: 1, gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Logo size={50} />

          <Typography variant="h6" color="primary.light">
            Tarrasque App
          </Typography>

          <Version />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CompendiumButton />

          <PluginsButton />

          <NotificationsButton />

          <Account />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
