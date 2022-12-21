import { Menu } from '@mui/icons-material';
import { AppBar, Box, IconButton, Link, Theme, Toolbar, Typography, useMediaQuery } from '@mui/material';

import { config } from '../../lib/config';
import { store } from '../../store';

export const TopBar: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  if (!isMobile) return null;

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton onClick={() => store.dashboard.toggleSidebar()}>
          <Menu />
        </IconButton>

        <Box
          component="img"
          src="/images/logo.svg"
          alt="Logo"
          sx={{
            width: 50,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />

        <Link href="https://tarrasque.app/changelog" target="_blank" rel="noopener noreferrer">
          <Typography variant="h5" sx={{ fontSize: '11px !important', color: 'text.secondary' }}>
            v{config.VERSION}
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
