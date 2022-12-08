import { GetApp } from '@mui/icons-material';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import { Color } from '../../lib/colors';
import { NextLink } from '../NextLink';

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

      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <GetApp />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}

        <NextLink href="/sign-out">Sign out</NextLink>
      </List>
    </Drawer>
  );
};
