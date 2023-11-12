import { Box } from '@mui/material';

import { BottomBar } from './BottomBar/BottomBar';
import { MapContextMenu } from './MapContextMenu';
import { Toolbar } from './Toolbar/Toolbar';
import { ZoomControls } from './ZoomControls';

export function Overlay() {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
      <MapContextMenu />
      <Toolbar />
      <ZoomControls />
      <BottomBar />
    </Box>
  );
}
