import { Brush, Category, PushPin, SquareFoot } from '@mui/icons-material';
import { Box, Paper, Tooltip, alpha } from '@mui/material';

import { Tool, useToolbarStore } from '@/store/useToolbarStore';
import { Color } from '@/utils/colors';

import { OverlayButtonGroup } from '../OverlayButtonGroup';
import { FogToolItem } from './FogToolItem';
import { SelectToolItem } from './SelectToolItem';
import { ToolButton } from './ToolButton';

export function Toolbar() {
  const tool = useToolbarStore((state) => state.tool);
  const setTool = useToolbarStore((state) => state.setTool);

  return (
    <Box sx={{ position: 'fixed', top: 8, left: 8, display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ background: alpha(Color.BLACK_LIGHT, 0.85) }}>
        <OverlayButtonGroup size="small" orientation="vertical">
          <SelectToolItem />

          <FogToolItem />

          <Tooltip title="Draw" placement="right">
            <ToolButton onClick={() => setTool(Tool.Draw)} selected={tool === Tool.Draw}>
              <Brush />
            </ToolButton>
          </Tooltip>

          <Tooltip title="Shape" placement="right">
            <ToolButton onClick={() => setTool(Tool.Shape)} selected={tool === Tool.Shape}>
              <Category />
            </ToolButton>
          </Tooltip>

          <Tooltip title="Measure" placement="right">
            <ToolButton onClick={() => setTool(Tool.Measure)} selected={tool === Tool.Measure}>
              <SquareFoot />
            </ToolButton>
          </Tooltip>

          <Tooltip title="Note" placement="right">
            <ToolButton onClick={() => setTool(Tool.Note)} selected={tool === Tool.Note}>
              <PushPin />
            </ToolButton>
          </Tooltip>
        </OverlayButtonGroup>
      </Paper>
    </Box>
  );
}
