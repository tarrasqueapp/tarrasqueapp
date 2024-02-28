import { GpsFixed } from '@mui/icons-material';
import { Chip, Fade, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper } from '@mui/material';

import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { useMapStore } from '@/store/map';
import { usePixiStore } from '@/store/pixi';

export function MapContextMenu() {
  const { data: map } = useGetCurrentMap();
  const { data: user } = useGetUser();

  const contextMenuVisible = useMapStore((state) => state.contextMenuVisible);
  const setContextMenuVisible = useMapStore((state) => state.setContextMenuVisible);
  const contextMenuAnchorPoint = useMapStore((state) => state.contextMenuAnchorPoint);
  const viewport = usePixiStore((state) => state.viewport);

  const width = 230;

  /**
   * Get the bounding rect for the anchor element
   * @returns The bounding rect
   */
  function getBoundingClientRect() {
    return {
      x: contextMenuAnchorPoint.x,
      y: contextMenuAnchorPoint.y,
      width,
      height: 0,
      top: contextMenuAnchorPoint.y,
      right: 0,
      bottom: 0,
      left: contextMenuAnchorPoint.x,
      toJSON: () => null,
    };
  }

  /**
   * Ping the location where the context menu was opened
   */
  function handlePingLocation() {
    if (!map || !user || !viewport) return;

    // Get the coordinates of the context menu relative to the map
    const { x, y } = contextMenuAnchorPoint;
    const position = viewport.toWorld(x, y);

    // Emit the ping location event
    // socket.emit(SocketEvent.PING_LOCATION, {
    //   position,
    //   color: 'red',
    //   mapId: map.id,
    //   userId: user.id,
    // });

    // Hide the context menu
    setContextMenuVisible(false);
  }

  return (
    <Popper open={contextMenuVisible} anchorEl={{ getBoundingClientRect }} transition>
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
}
