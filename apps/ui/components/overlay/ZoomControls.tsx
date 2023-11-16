import { Add, FitScreen, Fullscreen, FullscreenExit, Remove } from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip, alpha } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useGetCurrentMap } from '../../hooks/data/maps/useGetCurrentMap';
import { Color } from '../../lib/colors';
import { store } from '../../store';
import { HotkeysUtils } from '../../utils/HotkeyUtils';

export const ZoomControls = observer(function ZoomControls() {
  const { data: map } = useGetCurrentMap();

  const [isFullScreen, setIsFullScreen] = useState(false);

  /**
   * Handle zooming in with the mouse wheel
   * @param event - The mouse wheel event
   */
  function handleZoomIn(event: React.MouseEvent<HTMLElement, MouseEvent> | KeyboardEvent) {
    event.preventDefault();
    store.pixi.viewport.animate({ scale: store.pixi.viewport.scaled + 0.2, time: 100 });
  }

  /**
   * Handle zooming out with the mouse wheel
   * @param event - The mouse wheel event
   */
  function handleZoomOut(event: React.MouseEvent<HTMLElement, MouseEvent> | KeyboardEvent) {
    event.preventDefault();
    store.pixi.viewport.animate({ scale: Math.max(store.pixi.viewport.scaled - 0.2, 0), time: 100 });
  }

  /**
   * Handle zooming to fit the screen
   * @param event - The mouse wheel event
   */
  function handleFitScreen(event: React.MouseEvent<HTMLElement, MouseEvent> | KeyboardEvent) {
    event.preventDefault();
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

  /**
   * Listen for full screen change and update the state.
   */
  function handleFullScreenChange() {
    setIsFullScreen(document.fullscreenElement !== null);
  }

  // Register hotkeys
  useHotkeys(HotkeysUtils.ZoomIn, handleZoomIn, [handleZoomIn]);
  useHotkeys(HotkeysUtils.ZoomOut, handleZoomOut, {}, [handleZoomOut]);
  useHotkeys(HotkeysUtils.ZoomToFit, handleFitScreen, {}, [handleFitScreen]);

  // Listen for full screen change
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

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
