import { Fade, MenuItem, Paper, Popper } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { store } from '../store';

export const MapContextMenu: React.FC = observer(() => {
  function getBoundingClientRect() {
    return {
      x: store.map.contextMenuAnchorPoint.left,
      y: store.map.contextMenuAnchorPoint.top,
      width: 1,
      height: 1,
      top: store.map.contextMenuAnchorPoint.top,
      right: 1,
      bottom: 1,
      left: store.map.contextMenuAnchorPoint.left,
      toJSON: () => null,
    };
  }

  return (
    <Popper open={store.map.contextMenuVisible} anchorEl={{ getBoundingClientRect }} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <MenuItem>New File</MenuItem>
            <MenuItem>Save</MenuItem>
            <MenuItem>Print...</MenuItem>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
});
