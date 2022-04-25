import { SelectAll, TouchApp } from '@mui/icons-material';
import { Fade, Popper, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { bindHover, bindPopper, usePopupState } from 'material-ui-popup-state/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { Color } from '../../lib/enums';
import { store } from '../../store';
import { SelectTool, Tool } from '../../store/toolbar';

export const SelectToolItem: React.FC = observer(() => {
  const popupState = usePopupState({ variant: 'popper', popupId: 'selectTool' });

  const SingleSelectTool = (props: any) => {
    return (
      <Tooltip title="Single Select" followCursor>
        <ToggleButton
          value={SelectTool.Single}
          size="small"
          onClick={() => {
            store.toolbar.setTool(Tool.Select);
            store.toolbar.setSelectTool(SelectTool.Single);
            popupState.close();
          }}
          {...props}
        >
          <TouchApp />
        </ToggleButton>
      </Tooltip>
    );
  };

  const MultiSelectTool = (props: any) => {
    return (
      <Tooltip title="Multiple Select" followCursor>
        <ToggleButton
          value={SelectTool.Multi}
          size="small"
          onClick={() => {
            store.toolbar.setTool(Tool.Select);
            store.toolbar.setSelectTool(SelectTool.Multi);
            popupState.close();
          }}
          {...props}
        >
          <SelectAll />
        </ToggleButton>
      </Tooltip>
    );
  };

  const ActiveTool = useCallback((props: any) => {
    switch (store.toolbar.selectTool) {
      case SelectTool.Single:
        return <SingleSelectTool {...props} />;
      case SelectTool.Multi:
        return <MultiSelectTool {...props} />;
    }
  }, []);

  return (
    <>
      <ActiveTool selected={store.toolbar.tool === Tool.Select} {...bindHover(popupState)} />

      {popupState.isOpen && (
        <Popper {...bindPopper(popupState)} placement="right" transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <ToggleButtonGroup size="small" sx={{ background: Color.Black, ml: 0.5 }}>
                <SingleSelectTool selected={store.toolbar.selectTool === SelectTool.Single} />
                <MultiSelectTool selected={store.toolbar.selectTool === SelectTool.Multi} />
              </ToggleButtonGroup>
            </Fade>
          )}
        </Popper>
      )}
    </>
  );
});
