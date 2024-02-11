import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ButtonGroup, Fade, Paper, Popper, Tooltip } from '@mui/material';
import { bindHover, bindPopper, usePopupState } from 'material-ui-popup-state/hooks';
import { useCallback } from 'react';

import { FogTool, Tool, useToolbarStore } from '@/store/toolbar';

import { ToolButton, ToolButtonProps } from './ToolButton';

export function FogToolItem() {
  const { tool, setTool, fogTool, setFogTool } = useToolbarStore();
  const popupState = usePopupState({ variant: 'popper', popupId: 'fogTool' });

  const HideFogTool = (props: ToolButtonProps) => {
    return (
      <Tooltip title="Hide" disableInteractive>
        <ToolButton
          value={FogTool.Hide}
          size="small"
          onClick={() => {
            setTool(Tool.Fog);
            setFogTool(FogTool.Hide);
            popupState.close();
          }}
          {...props}
        >
          <VisibilityOff />
        </ToolButton>
      </Tooltip>
    );
  };

  const ShowFogTool = (props: ToolButtonProps) => {
    return (
      <Tooltip title="Show" disableInteractive>
        <ToolButton
          value={FogTool.Show}
          size="small"
          onClick={() => {
            setTool(Tool.Fog);
            setFogTool(FogTool.Show);
            popupState.close();
          }}
          {...props}
        >
          <Visibility />
        </ToolButton>
      </Tooltip>
    );
  };

  const ActiveTool = useCallback((props: ToolButtonProps) => {
    switch (fogTool) {
      case FogTool.Hide:
        return <HideFogTool {...props} />;
      case FogTool.Show:
        return <ShowFogTool {...props} />;
    }
  }, []);

  return (
    <>
      <ActiveTool selected={tool === Tool.Fog} {...bindHover(popupState)} />

      {popupState.isOpen && (
        <Popper {...bindPopper(popupState)} placement="right" transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper sx={{ ml: 0.5 }}>
                <ButtonGroup size="small">
                  <HideFogTool selected={tool === Tool.Fog && fogTool === FogTool.Hide} />
                  <ShowFogTool selected={tool === Tool.Fog && fogTool === FogTool.Show} />
                </ButtonGroup>
              </Paper>
            </Fade>
          )}
        </Popper>
      )}
    </>
  );
}
