import { Add, FitScreen, Fullscreen, FullscreenExit, Remove } from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip, alpha } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { useGetCurrentMap } from '../../hooks/data/maps/useGetCurrentMap';
import { useDocumentEventListener } from '../../hooks/useDocumentEventListener';
import { Color } from '../../lib/colors';
import { store } from '../../store';

export const ZoomControls = observer(function ZoomControls() {
  const { data: map } = useGetCurrentMap();

  const [isFullScreen, setIsFullScreen] = useState(false);

  /**
   * Handle zooming in with the mouse wheel
   */
  function handleZoomIn() {
    store.pixi.viewport.animate({ scale: store.pixi.viewport.scaled + 0.2, time: 100 });
  }

  /**
   * Handle zooming out with the mouse wheel
   */
  function handleZoomOut() {
    store.pixi.viewport.animate({ scale: Math.max(store.pixi.viewport.scaled - 0.2, 0), time: 100 });
  }

  /**
   * Handle zooming to fit the screen
   * @param event - The mouse wheel event
   */
  function handleFitScreen() {
    if (!map) return;
    const media = map.media.find((media) => media.id === map.selectedMediaId)!;
    store.pixi.viewport.animate({
      position: { x: media.width / 2, y: media.height / 2 },
      scale: Math.min(window.innerWidth / media.width, window.innerHeight / media.height),
      time: 100,
    });
  }

  /**
   * Toggle full screen mode.
   */
  function handleFullScreen() {
    if (isFullScreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    }
  }

  // Prevent the default context menu on non-canvas elements
  useDocumentEventListener('contextmenu', (event: MouseEvent) => {
    const target = event.target as HTMLCanvasElement;
    if (target?.nodeName !== 'CANVAS') {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Listen for full screen change and update the state.
  useDocumentEventListener('fullscreenchange', () => {
    setIsFullScreen(document.fullscreenElement !== null);
  });

  // Disable the ctrl + and ctrl - zoom gestures on non-canvas elements
  useDocumentEventListener('keydown', (event: KeyboardEvent) => {
    // Ctrl/Cmd + Minus (or NumpadSubtract)
    if ((event.ctrlKey || event.metaKey) && (event.key === '-' || event.key === 'NumpadSubtract')) {
      handleZoomOut();
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Ctrl/Cmd + Plus (or NumpadAdd)
    if ((event.ctrlKey || event.metaKey) && (event.key === '=' || event.key === 'NumpadAdd')) {
      handleZoomIn();
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Ctrl/Cmd + 0 (or Numpad0)
    if ((event.ctrlKey || event.metaKey) && (event.key === '0' || event.key === 'Numpad0')) {
      handleFitScreen();
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Disable the pinch to zoom gesture on non-canvas elements
  useDocumentEventListener(
    'wheel',
    (event: WheelEvent) => {
      const target = event.target as HTMLCanvasElement;
      if (target?.nodeName !== 'CANVAS' && event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    },
    { passive: false },
  );

  return (
    <Box sx={{ position: 'fixed', top: 4, right: 4, display: 'flex', flexDirection: 'column' }}>
      <ToggleButtonGroup orientation="vertical" sx={{ background: alpha(Color.BLACK_LIGHT, 0.9) }}>
        <Tooltip title="Zoom In" placement="left">
          <ToggleButton value="zoom-in" size="small" onClick={handleZoomIn}>
            <Add />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Zoom Out" placement="left">
          <ToggleButton value="zoom-out" size="small" onClick={handleZoomOut}>
            <Remove />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Fit Screen" placement="left">
          <ToggleButton value="fit-screen" size="small" onClick={handleFitScreen}>
            <FitScreen />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Full Screen" placement="left">
          <ToggleButton value="full-screen" size="small" selected={isFullScreen} onChange={() => handleFullScreen()}>
            {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Box>
  );
});
