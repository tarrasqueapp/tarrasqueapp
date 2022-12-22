import { Add, ExitToApp } from '@mui/icons-material';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import NextLink from 'next/link';
import { useCallback } from 'react';

import { AppNavigation } from '../../lib/navigation';
import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';
import { Logo } from '../common/Logo';
import { Version } from './Version';

export const Sidebar: React.FC = observer(() => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const ref = useCallback((node: HTMLDivElement) => store.dashboard.setSidebar(node), []);

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

        <Typography variant="h5" color="primary.light" align="center" sx={{ mb: -1 }}>
          Tarrasque App
        </Typography>

        <Version />
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
