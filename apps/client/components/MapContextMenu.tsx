import { GpsFixed } from '@mui/icons-material';
import {
  Chip,
  Fade,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import { observer } from 'mobx-react-lite';

import { store } from '../store';

export const MapContextMenu: React.FC = observer(() => {
  const width = 230;

  function getBoundingClientRect() {
    return {
      x: store.map.contextMenuAnchorPoint.left,
      y: store.map.contextMenuAnchorPoint.top,
      width,
      height: 0,
      top: store.map.contextMenuAnchorPoint.top,
      right: 0,
      bottom: 0,
      left: store.map.contextMenuAnchorPoint.left,
      toJSON: () => null,
    };
  }

  return (
    <Popper open={store.map.contextMenuVisible} anchorEl={{ getBoundingClientRect }} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <MenuList>
              <MenuItem sx={{ width }}>
                <ListItemIcon>
                  <GpsFixed fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Ping Location" />
                <ListItemSecondaryAction>
                  <Chip label="DBL" />
                </ListItemSecondaryAction>
              </MenuItem>
            </MenuList>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
});
