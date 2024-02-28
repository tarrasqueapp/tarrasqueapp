import { SelectAll, TouchApp } from '@mui/icons-material';
import { Fade, Paper, Popper, Tooltip } from '@mui/material';
import { bindHover, bindPopper, usePopupState } from 'material-ui-popup-state/hooks';
import { useCallback } from 'react';

import { SelectTool, Tool, useToolbarStore } from '@/store/toolbar';

import { OverlayButtonGroup } from '../OverlayButtonGroup';
import { ToolButton, ToolButtonProps } from './ToolButton';

export function SelectToolItem() {
  const tool = useToolbarStore((state) => state.tool);
  const setTool = useToolbarStore((state) => state.setTool);
  const selectTool = useToolbarStore((state) => state.selectTool);
  const setSelectTool = useToolbarStore((state) => state.setSelectTool);

  const popupState = usePopupState({ variant: 'popper', popupId: 'selectTool' });

  const SingleSelectTool = (props: ToolButtonProps) => {
    return (
      <Tooltip title="Single Select" disableInteractive>
        <ToolButton
          value={SelectTool.Single}
          size="small"
          onClick={() => {
            setTool(Tool.Select);
            setSelectTool(SelectTool.Single);
            popupState.close();
          }}
          {...props}
        >
          <TouchApp />
        </ToolButton>
      </Tooltip>
    );
  };

  const MultiSelectTool = (props: ToolButtonProps) => {
    return (
      <Tooltip title="Multiple Select" disableInteractive>
        <ToolButton
          value={SelectTool.Multi}
          size="small"
          onClick={() => {
            setTool(Tool.Select);
            setSelectTool(SelectTool.Multi);
            popupState.close();
          }}
          {...props}
        >
          <SelectAll />
        </ToolButton>
      </Tooltip>
    );
  };

  const ActiveTool = useCallback(
    (props: ToolButtonProps) => {
      switch (selectTool) {
        case SelectTool.Single:
          return <SingleSelectTool {...props} />;
        case SelectTool.Multi:
          return <MultiSelectTool {...props} />;
      }
    },
    [selectTool],
  );

  return (
    <>
      <ActiveTool selected={tool === Tool.Select} {...bindHover(popupState)} />

      {popupState.isOpen && (
        <Popper {...bindPopper(popupState)} placement="right" transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper sx={{ ml: 0.5 }}>
                <OverlayButtonGroup size="small">
                  <SingleSelectTool selected={tool === Tool.Select && selectTool === SelectTool.Single} />
                  <MultiSelectTool selected={tool === Tool.Select && selectTool === SelectTool.Multi} />
                </OverlayButtonGroup>
              </Paper>
            </Fade>
          )}
        </Popper>
      )}
    </>
  );
}
