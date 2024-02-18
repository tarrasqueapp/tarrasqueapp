import { Box, Stack } from '@mui/material';

import { Dock } from './Dock/Dock';
import { GridSettings } from './GridSettings';
import { MapContextMenu } from './MapContextMenu';
import { Toolbar } from './Toolbar/Toolbar';
import { ZoomControls } from './ZoomControls';

export function Overlay() {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
      <MapContextMenu />
      <Toolbar />

      <Stack sx={{ position: 'fixed', top: 8, right: 8 }}>
        <ZoomControls />
        <GridSettings />
      </Stack>

      <Dock />
    </Box>
  );
}
