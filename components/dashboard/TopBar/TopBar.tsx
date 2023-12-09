import { AppBar, Box, Toolbar, Typography } from '@mui/material';

import { Logo } from '@/components/common/Logo';

import { Account } from './Account/Account';
import { Notifications } from './Notifications/Notifications';
import { Version } from './Version';

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
          <Notifications />

          <Account />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
