import { Box } from '@mui/material';

import { MapContextMenu } from './MapContextMenu';
import { Toolbar } from './Toolbar/Toolbar';
import { ZoomControls } from './ZoomControls';

export const HUD: React.FC = () => {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
      <MapContextMenu />
      <Toolbar />
      <ZoomControls />
    </Box>
  );
};
