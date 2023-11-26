import { Brush, Category, PushPin, SquareFoot } from '@mui/icons-material';
import { Box, ButtonGroup, Paper, Tooltip, alpha } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { Color } from '../../../lib/colors';
import { store } from '../../../store';
import { Tool } from '../../../store/toolbar';
import { FogToolItem } from './FogToolItem';
import { SelectToolItem } from './SelectToolItem';
import { ToolButton } from './ToolButton';

export const Toolbar = observer(function Toolbar() {
  return (
    <Box sx={{ position: 'fixed', top: 8, left: 8, display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ background: alpha(Color.BLACK_LIGHT, 0.85) }}>
        <ButtonGroup size="small" orientation="vertical">
          <SelectToolItem />

          <FogToolItem />

          <Tooltip title="Draw" placement="right">
            <ToolButton onClick={() => store.toolbar.setTool(Tool.Draw)} selected={store.toolbar.tool === Tool.Draw}>
              <Brush />
            </ToolButton>
          </Tooltip>

          <Tooltip title="Shape" placement="right">
            <ToolButton onClick={() => store.toolbar.setTool(Tool.Shape)} selected={store.toolbar.tool === Tool.Shape}>
              <Category />
            </ToolButton>
          </Tooltip>

          <Tooltip title="Measure" placement="right">
            <ToolButton
              onClick={() => store.toolbar.setTool(Tool.Measure)}
              selected={store.toolbar.tool === Tool.Measure}
            >
              <SquareFoot />
            </ToolButton>
          </Tooltip>

          <Tooltip title="Note" placement="right">
            <ToolButton onClick={() => store.toolbar.setTool(Tool.Note)} selected={store.toolbar.tool === Tool.Note}>
              <PushPin />
            </ToolButton>
          </Tooltip>
        </ButtonGroup>
      </Paper>
    </Box>
  );
});
