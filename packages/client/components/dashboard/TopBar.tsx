import { Menu } from '@mui/icons-material';
import {
  AppBar,
  Badge,
  IconButton,
  Link,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  badgeClasses,
  useMediaQuery,
} from '@mui/material';

import { useGetLiveVersion } from '../../hooks/useGetLiveVersion';
import { config } from '../../lib/config';
import { store } from '../../store';
import { Logo } from '../common/Logo';

export const TopBar: React.FC = () => {
  const { data: liveVersion } = useGetLiveVersion();

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const isLatest = liveVersion?.version === `v${config.VERSION}`;

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

        <Tooltip title={isLatest ? undefined : 'New version available'}>
          <Badge
            variant="dot"
            invisible={isLatest}
            color="info"
            sx={{ [`& .${badgeClasses.badge}`]: { right: -6, top: 6 } }}
          >
            <Link href="https://tarrasque.app/changelog" target="_blank" rel="noopener noreferrer">
              <Typography align="center" variant="h5" sx={{ fontSize: '11px !important', color: 'text.secondary' }}>
                v{config.VERSION}
              </Typography>
            </Link>
          </Badge>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
