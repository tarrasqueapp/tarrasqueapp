import { Brush, Category, PushPin, SquareFoot } from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { Color } from '../../../lib/colors';
import { store } from '../../../store';
import { Tool } from '../../../store/toolbar';
import { FogToolItem } from './FogToolItem';
import { SelectToolItem } from './SelectToolItem';

export const Toolbar: React.FC = observer(() => {
  return (
    <Box sx={{ position: 'fixed', top: 4, left: 4, display: 'flex', flexDirection: 'column' }}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={store.toolbar.tool}
        onChange={(event, newTool) => newTool && store.toolbar.setTool(newTool)}
        orientation="vertical"
        sx={{ background: Color.BlackLight }}
      >
        <SelectToolItem />

        <FogToolItem />

        <Tooltip title="Draw">
          <ToggleButton value={Tool.Draw} selected={store.toolbar.tool === Tool.Draw}>
            <Brush />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Shape">
          <ToggleButton value={Tool.Shape} selected={store.toolbar.tool === Tool.Shape}>
            <Category />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Measure">
          <ToggleButton value={Tool.Measure} selected={store.toolbar.tool === Tool.Measure}>
            <SquareFoot />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Note">
          <ToggleButton value={Tool.Note} selected={store.toolbar.tool === Tool.Note}>
            <PushPin />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Box>
  );
});
