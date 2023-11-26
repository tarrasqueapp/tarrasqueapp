import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ButtonGroup, Fade, Paper, Popper, Tooltip } from '@mui/material';
import { bindHover, bindPopper, usePopupState } from 'material-ui-popup-state/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { store } from '../../../store';
import { FogTool, Tool } from '../../../store/toolbar';
import { ToolButton } from './ToolButton';

export const FogToolItem = observer(function FogToolItem() {
  const popupState = usePopupState({ variant: 'popper', popupId: 'fogTool' });

  const HideFogTool = (props: any) => {
    return (
      <Tooltip title="Hide" disableInteractive>
        <ToolButton
          value={FogTool.Hide}
          size="small"
          onClick={() => {
            store.toolbar.setTool(Tool.Fog);
            store.toolbar.setFogTool(FogTool.Hide);
            popupState.close();
          }}
          {...props}
        >
          <VisibilityOff />
        </ToolButton>
      </Tooltip>
    );
  };

  const ShowFogTool = (props: any) => {
    return (
      <Tooltip title="Show" disableInteractive>
        <ToolButton
          value={FogTool.Show}
          size="small"
          onClick={() => {
            store.toolbar.setTool(Tool.Fog);
            store.toolbar.setFogTool(FogTool.Show);
            popupState.close();
          }}
          {...props}
        >
          <Visibility />
        </ToolButton>
      </Tooltip>
    );
  };

  const ActiveTool = useCallback((props: any) => {
    switch (store.toolbar.fogTool) {
      case FogTool.Hide:
        return <HideFogTool {...props} />;
      case FogTool.Show:
        return <ShowFogTool {...props} />;
    }
  }, []);

  return (
    <>
      <ActiveTool selected={store.toolbar.tool === Tool.Fog} {...bindHover(popupState)} />

      {popupState.isOpen && (
        <Popper {...bindPopper(popupState)} placement="right" transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper sx={{ ml: 0.5 }}>
                <ButtonGroup size="small">
                  <HideFogTool selected={store.toolbar.tool === Tool.Fog && store.toolbar.fogTool === FogTool.Hide} />
                  <ShowFogTool selected={store.toolbar.tool === Tool.Fog && store.toolbar.fogTool === FogTool.Show} />
                </ButtonGroup>
              </Paper>
            </Fade>
          )}
        </Popper>
      )}
    </>
  );
});
