import { GpsFixed } from '@mui/icons-material';
import { Chip, Fade, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { TarrasqueEvent, tarrasque } from '@tarrasque/sdk';

import { useGetUser } from '../../hooks/data/auth/useGetUser';
import { useGetCurrentMap } from '../../hooks/data/maps/useGetCurrentMap';
import { store } from '../../store';

export const MapContextMenu = observer(function MapContextMenu() {
  const { data: map } = useGetCurrentMap();
  const { data: user } = useGetUser();

  const width = 230;

  /**
   * Get the bounding rect for the anchor element
   * @returns The bounding rect
   */
  function getBoundingClientRect() {
    return {
      x: store.map.contextMenuAnchorPoint.x,
      y: store.map.contextMenuAnchorPoint.y,
      width,
      height: 0,
      top: store.map.contextMenuAnchorPoint.y,
      right: 0,
      bottom: 0,
      left: store.map.contextMenuAnchorPoint.x,
      toJSON: () => null,
    };
  }

  /**
   * Ping the location where the context menu was opened
   */
  function handlePingLocation() {
    if (!map || !user) return;

    // Get the coordinates of the context menu relative to the map
    const { x, y } = store.map.contextMenuAnchorPoint;
    const coordinates = store.pixi.viewport.toWorld(x, y);

    // Emit the ping location event
    tarrasque.emit(TarrasqueEvent.PING_LOCATION, {
      coordinates,
      color: 'red',
      mapId: map.id,
      userId: user.id,
    });

    // Hide the context menu
    store.map.setContextMenuVisible(false);
  }

  return (
    <Popper open={store.map.contextMenuVisible} anchorEl={{ getBoundingClientRect }} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <MenuList>
              <MenuItem onClick={handlePingLocation} sx={{ width }}>
                <ListItemIcon>
                  <GpsFixed />
                </ListItemIcon>
                <ListItemText primary="Ping Location" />
                <Chip label="DBL" size="small" sx={{ ml: 1 }} />
              </MenuItem>
            </MenuList>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
});
