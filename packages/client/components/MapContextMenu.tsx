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
      x: store.maps.contextMenuAnchorPoint.x,
      y: store.maps.contextMenuAnchorPoint.y,
      width,
      height: 0,
      top: store.maps.contextMenuAnchorPoint.y,
      right: 0,
      bottom: 0,
      left: store.maps.contextMenuAnchorPoint.x,
      toJSON: () => null,
    };
  }

  function handlePingLocation() {
    store.app.socket.emit('pingLocation', { mapId: store.maps.currentMap?.id, ...store.maps.contextMenuAnchorPoint });
    store.maps.setContextMenuVisible(false);
  }

  return (
    <Popper open={store.maps.contextMenuVisible} anchorEl={{ getBoundingClientRect }} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <MenuList>
              <MenuItem onClick={handlePingLocation} sx={{ width }}>
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
