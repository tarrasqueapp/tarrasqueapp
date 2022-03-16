import { Add, FitScreen, Remove } from '@mui/icons-material';
import { Box, Button, ButtonGroup } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { Color } from '../lib/enums';
import { store } from '../store';

export const HUD: React.FC = observer(() => {
  function handleZoomIn() {
    store.app.viewport.animate({ scale: store.app.viewport.scaled + 0.2, time: 100 });
  }

  function handleZoomOut() {
    store.app.viewport.animate({ scale: Math.max(store.app.viewport.scaled - 0.2, 0), time: 100 });
  }

  function handleFitScreen() {
    store.app.viewport.animate({
      position: { x: store.map.dimensions.width / 2, y: store.map.dimensions.height / 2 },
      scale: Math.min(window.innerWidth / store.map.dimensions.width, window.innerHeight / store.map.dimensions.height),
      time: 100,
    });
  }

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
      <ButtonGroup
        orientation="vertical"
        aria-label="vertical contained button group"
        variant="outlined"
        sx={{ position: 'fixed', top: 4, right: 4, background: Color.Black }}
      >
        <Button size="small" onClick={handleZoomIn}>
          <Add />
        </Button>
        <Button size="small" onClick={handleZoomOut}>
          <Remove />
        </Button>
        <Button size="small" onClick={handleFitScreen}>
          <FitScreen />
        </Button>
      </ButtonGroup>
    </Box>
  );
});
