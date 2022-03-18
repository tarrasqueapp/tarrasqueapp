import { Box } from '@mui/material';

import { MapContextMenu } from './MapContextMenu';
import { ZoomControls } from './ZoomControls';

export const HUD: React.FC = () => {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
      <MapContextMenu />
      <ZoomControls />
    </Box>
  );
};
