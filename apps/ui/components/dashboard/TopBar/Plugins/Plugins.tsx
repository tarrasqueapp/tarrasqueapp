import { Extension } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

export function Plugins() {
  return (
    <Tooltip title="Plugins">
      <IconButton>
        <Extension />
      </IconButton>
    </Tooltip>
  );
}
