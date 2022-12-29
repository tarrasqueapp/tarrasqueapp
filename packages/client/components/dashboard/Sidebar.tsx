import { Add, Logout, Settings, UnfoldMore } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
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
import { useCallback, useState } from 'react';

import { useGetUser } from '../../hooks/data/users/useGetUser';
import { AppNavigation } from '../../lib/navigation';
import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';
import { Logo } from '../common/Logo';
import { Version } from './Version';

export const Sidebar: React.FC = observer(() => {
  const { data: user } = useGetUser();

  const [userExpanded, setUserExpanded] = useState(false);

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

        <Typography variant="h6" color="primary.light" align="center" sx={{ mb: -1 }}>
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

        <Box>
          <Divider />

          <Collapse in={userExpanded}>
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemButton onClick={() => store.dashboard.toggleSettingsModal()}>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>

              <NextLink href={AppNavigation.SignOut} passHref legacyBehavior>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Sign out" />
                  </ListItemButton>
                </ListItem>
              </NextLink>
            </List>

            <Divider />
          </Collapse>

          <ListItem
            disablePadding
            secondaryAction={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <UnfoldMore />
              </Box>
            }
          >
            <ListItemButton onClick={() => setUserExpanded(!userExpanded)}>
              <ListItemAvatar>
                <Avatar src={user?.avatar?.thumbnailUrl} />
              </ListItemAvatar>

              <ListItemText primary={user?.name} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
});
