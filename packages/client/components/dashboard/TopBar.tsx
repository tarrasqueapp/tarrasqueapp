import { Menu } from '@mui/icons-material';
import { AppBar, IconButton, Theme, Toolbar, useMediaQuery } from '@mui/material';

import { store } from '../../store';
import { Logo } from '../common/Logo';
import { Version } from './Version';

export const TopBar: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  if (!isMobile) return null;

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton onClick={() => store.dashboard.toggleSidebar()}>
          <Menu />
        </IconButton>

        <Logo
          size={50}
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />

        <Version />
      </Toolbar>
    </AppBar>
  );
};
