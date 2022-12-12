import { Menu } from '@mui/icons-material';
import { AppBar, Box, IconButton, Theme, Toolbar, useMediaQuery } from '@mui/material';

import { store } from '../../store';

export const TopBar: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  if (!isMobile) return null;

  return (
    <AppBar position="sticky">
      <Toolbar>
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
      </Toolbar>
    </AppBar>
  );
};
