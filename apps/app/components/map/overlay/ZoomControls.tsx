import { Add, FitScreen, Fullscreen, FullscreenExit, Remove } from '@mui/icons-material';
import { Box, Paper, Tooltip, alpha } from '@mui/material';
import { useState } from 'react';

import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { useDocumentEventListener } from '@/hooks/useDocumentEventListener';
import { usePixiStore } from '@/store/usePixiStore';
import { Color } from '@/utils/colors';

import { OverlayButtonGroup } from './OverlayButtonGroup';
import { ToolButton } from './Toolbar/ToolButton';

export function ZoomControls() {
  const { data: map } = useGetCurrentMap();

  const viewport = usePixiStore((state) => state.viewport);

  const [isFullScreen, setIsFullScreen] = useState(false);

  /**
   * Handle zooming in with the mouse wheel
   */
  function handleZoomIn() {
    if (!viewport) return;

    viewport.animate({ scale: viewport.scaled + 0.2, time: 100 });
  }

  /**
   * Handle zooming out with the mouse wheel
   */
  function handleZoomOut() {
    if (!viewport) return;

    viewport.animate({ scale: Math.max(viewport.scaled - 0.2, 0), time: 100 });
  }

  /**
   * Handle zooming to fit the screen
   * @param event - The mouse wheel event
   */
  function handleFitScreen() {
    if (!viewport || !map?.media || !map.media.width || !map.media.height) return;

    viewport.animate({
      position: { x: map.media.width / 2, y: map.media.height / 2 },
      scale: Math.min(window.innerWidth / map.media.width, window.innerHeight / map.media.height),
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ background: alpha(Color.BLACK_LIGHT, 0.85) }}>
        <OverlayButtonGroup orientation="vertical" size="small">
          <Tooltip title="Zoom In" placement="left">
            <ToolButton onClick={handleZoomIn}>
              <Add />
            </ToolButton>
          </Tooltip>

          <Tooltip title="Zoom Out" placement="left">
            <ToolButton onClick={handleZoomOut}>
              <Remove />
            </ToolButton>
          </Tooltip>

          <Tooltip title="Fit Screen" placement="left">
            <ToolButton onClick={handleFitScreen}>
              <FitScreen />
            </ToolButton>
          </Tooltip>

          <Tooltip title="Full Screen" placement="left">
            <ToolButton selected={isFullScreen} onClick={handleFullScreen}>
              {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
            </ToolButton>
          </Tooltip>
        </OverlayButtonGroup>
      </Paper>
    </Box>
  );
}
