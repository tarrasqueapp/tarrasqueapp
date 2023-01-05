import { Box } from '@mui/material';

import { BottomBar } from './BottomBar';
import { MapContextMenu } from './MapContextMenu';
import { Toolbar } from './Toolbar/Toolbar';
import { ZoomControls } from './ZoomControls';

export const Overlay: React.FC = () => {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
      <MapContextMenu />
      <Toolbar />
      <ZoomControls />
      <BottomBar />
    </Box>
  );
};
