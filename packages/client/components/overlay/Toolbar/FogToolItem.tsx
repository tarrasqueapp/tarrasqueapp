import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Fade, Popper, ToggleButton, ToggleButtonGroup, Tooltip, alpha } from '@mui/material';
import { bindHover, bindPopper, usePopupState } from 'material-ui-popup-state/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { Color } from '../../../lib/colors';
import { store } from '../../../store';
import { FogTool, Tool } from '../../../store/toolbar';

export const FogToolItem: React.FC = observer(() => {
  const popupState = usePopupState({ variant: 'popper', popupId: 'fogTool' });

  const HideFogTool = (props: any) => {
    return (
      <Tooltip title="Hide">
        <ToggleButton
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
        </ToggleButton>
      </Tooltip>
    );
  };

  const ShowFogTool = (props: any) => {
    return (
      <Tooltip title="Show">
        <ToggleButton
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
        </ToggleButton>
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
              <ToggleButtonGroup size="small" sx={{ background: alpha(Color.BlackLight, 0.9), ml: 0.5 }}>
                <HideFogTool selected={store.toolbar.tool === Tool.Fog && store.toolbar.fogTool === FogTool.Hide} />
                <ShowFogTool selected={store.toolbar.tool === Tool.Fog && store.toolbar.fogTool === FogTool.Show} />
              </ToggleButtonGroup>
            </Fade>
          )}
        </Popper>
      )}
    </>
  );
});
