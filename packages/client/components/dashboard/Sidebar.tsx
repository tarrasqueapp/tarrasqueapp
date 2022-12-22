import { Add, ExitToApp } from '@mui/icons-material';
import {
  Badge,
  Box,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Theme,
  Tooltip,
  Typography,
  badgeClasses,
  useMediaQuery,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import NextLink from 'next/link';
import { useCallback } from 'react';

import { useGetLiveVersion } from '../../hooks/useGetLiveVersion';
import { config } from '../../lib/config';
import { AppNavigation } from '../../lib/navigation';
import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';
import { Logo } from '../common/Logo';

export const Sidebar: React.FC = observer(() => {
  const { data: liveVersion } = useGetLiveVersion();

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const ref = useCallback((node: HTMLDivElement) => store.dashboard.setSidebar(node), []);

  const isLatest = liveVersion?.version === `v${config.VERSION}`;

  return (
    <SwipeableDrawer
      ref={ref}
      sx={{ width: 250, '& .MuiDrawer-paper': { width: 250 } }}
      open={store.dashboard.sidebarOpen}
      onOpen={() => store.dashboard.toggleSidebar(true)}
      onClose={() => store.dashboard.toggleSidebar(false)}
      variant={isMobile ? 'temporary' : 'permanent'}
      anchor="left"
    >
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Logo size={150} />

        <Typography variant="h5" color="primary.light" align="center">
          Tarrasque App
        </Typography>

        <Tooltip title={isLatest ? undefined : 'New version available'}>
          <Badge
            variant="dot"
            invisible={isLatest}
            color="info"
            sx={{ mt: -1, [`& .${badgeClasses.badge}`]: { right: -6, top: 6 } }}
          >
            <Link href="https://tarrasque.app/changelog" target="_blank" rel="noopener noreferrer">
              <Typography align="center" variant="h5" sx={{ fontSize: '11px !important', color: 'text.secondary' }}>
                v{config.VERSION}
              </Typography>
            </Link>
          </Badge>
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 0 auto',
          justifyContent: 'space-between',
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => store.campaigns.setModal(CampaignModal.CreateUpdate)}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Create Campaign" />
            </ListItemButton>
          </ListItem>
        </List>

        <List>
          <NextLink href={AppNavigation.SignOut} passHref legacyBehavior>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Sign out" />
              </ListItemButton>
            </ListItem>
          </NextLink>
        </List>
      </Box>
    </SwipeableDrawer>
  );
});
