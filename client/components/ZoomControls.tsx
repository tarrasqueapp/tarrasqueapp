import { Add, FitScreen, Fullscreen, FullscreenExit, Remove } from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { Color } from '../lib/enums';
import { store } from '../store';

export const ZoomControls: React.FC = observer(() => {
  function handleZoomIn() {
    store.pixi.viewport.animate({ scale: store.pixi.viewport.scaled + 0.2, time: 100 });
  }

  function handleZoomOut() {
    store.pixi.viewport.animate({ scale: Math.max(store.pixi.viewport.scaled - 0.2, 0), time: 100 });
  }

  function handleFitScreen() {
    store.pixi.viewport.animate({
      position: { x: store.map.dimensions.width / 2, y: store.map.dimensions.height / 2 },
      scale: Math.min(window.innerWidth / store.map.dimensions.width, window.innerHeight / store.map.dimensions.height),
      time: 100,
    });
  }

  return (
    <Box sx={{ position: 'fixed', top: 4, right: 4, display: 'flex', flexDirection: 'column' }}>
      <ToggleButtonGroup orientation="vertical" sx={{ background: Color.Black }}>
        <Tooltip title="Zoom In" placement="left" followCursor>
          <ToggleButton value="zoom-in" size="small" onClick={handleZoomIn}>
            <Add />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Zoom Out" placement="left" followCursor>
          <ToggleButton value="zoom-out" size="small" onClick={handleZoomOut}>
            <Remove />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Fit Screen" placement="left" followCursor>
          <ToggleButton value="fit-screen" size="small" onClick={handleFitScreen}>
            <FitScreen />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Full Screen" placement="left" followCursor>
          <ToggleButton
            value="full-screen"
            size="small"
            selected={store.app.fullScreen}
            onChange={() => store.app.toggleFullScreen()}
          >
            {store.app.fullScreen ? <FullscreenExit /> : <Fullscreen />}
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Box>
  );
});
