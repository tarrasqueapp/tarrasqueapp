import { Add, ExitToApp } from '@mui/icons-material';
import {
  Box,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import NextLink from 'next/link';
import { useCallback } from 'react';

import { config } from '../../lib/config';
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
      <Box sx={{ py: 2, textAlign: 'center', position: 'relative' }}>
        <img src="/images/logo.svg" alt="Logo" width="150" />

        <Link href="https://tarrasque.app/changelog" target="_blank" rel="noopener noreferrer">
          <Typography
            variant="h5"
            sx={{
              fontSize: '11px !important',
              color: 'text.secondary',
              position: 'absolute',
              bottom: 15,
              left: '50%',
              transform: 'translate(-50%)',
            }}
          >
            {config.VERSION}
          </Typography>
        </Link>
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
