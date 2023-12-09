import { Dock } from '@mui/icons-material';
import { Box, Toolbar } from '@mui/material';

import { MapContextMenu } from './MapContextMenu';
import { ZoomControls } from './ZoomControls';

export function Overlay() {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
      <MapContextMenu />
      <Toolbar />
      <ZoomControls />
      <Dock />
    </Box>
  );
}
