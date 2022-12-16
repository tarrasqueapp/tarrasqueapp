import { Add, ExitToApp } from '@mui/icons-material';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import NextLink from 'next/link';
import { useCallback } from 'react';

import { AppNavigation } from '../../lib/navigation';
import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';

export const Sidebar: React.FC = observer(() => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const ref = useCallback((node: HTMLDivElement) => store.dashboard.setSidebar(node), []);

  return (
    <Drawer
      ref={ref}
      sx={{ width: 250, '& .MuiDrawer-paper': { width: 250 } }}
      open={store.dashboard.sidebarOpen}
      onClose={() => store.dashboard.toggleSidebar(false)}
      variant={isMobile ? 'temporary' : 'permanent'}
      anchor="left"
    >
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <img src="/images/logo.svg" alt="Logo" width="150" />
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
    </Drawer>
  );
});
