import { Brush, Category, PushPin, SquareFoot, VisibilityOff } from '@mui/icons-material';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';

import { Color } from '../../lib/enums';
import { Tool } from '../../store/toolbar';
import { SelectToolItem } from './SelectToolItem';

export const Toolbar: React.FC = () => {
  function handlePanMode() {}

  return (
    <Box sx={{ position: 'fixed', top: 4, left: 4, display: 'flex', flexDirection: 'column' }}>
      <ToggleButtonGroup orientation="vertical" sx={{ background: Color.Black }}>
        <SelectToolItem />

        <Tooltip title="Fog" followCursor>
          <ToggleButton value={Tool.Fog} size="small" onClick={handlePanMode}>
            <VisibilityOff />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Draw" followCursor>
          <ToggleButton value={Tool.Draw} size="small" onClick={handlePanMode}>
            <Brush />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Shape" followCursor>
          <ToggleButton value={Tool.Shape} size="small" onClick={handlePanMode}>
            <Category />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Measure" followCursor>
          <ToggleButton value={Tool.Measure} size="small" onClick={handlePanMode}>
            <SquareFoot />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Note" followCursor>
          <ToggleButton value={Tool.Note} size="small" onClick={handlePanMode}>
            <PushPin />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Box>
  );
};
