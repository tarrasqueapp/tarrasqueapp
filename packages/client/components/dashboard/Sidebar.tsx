import { Add, ExitToApp } from '@mui/icons-material';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import NextLink from 'next/link';

import { Color } from '../../lib/colors';
import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';

export const Sidebar: React.FC = () => {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          borderRadius: 0,
          boxSizing: 'border-box',
          background: Color.BlackLight,
        },
      }}
      variant="permanent"
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
            <ListItemButton onClick={() => store.campaigns.setModal(CampaignModal.AddEdit)}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Add Campaign" />
            </ListItemButton>
          </ListItem>
        </List>

        <List>
          <NextLink href="/sign-out" passHref legacyBehavior>
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
};
