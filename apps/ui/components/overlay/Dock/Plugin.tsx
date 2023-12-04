import { Box, Fade, Paper, Popper, Tooltip } from '@mui/material';
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

import { useGetPlugin } from '../../../hooks/data/plugins/useGetPlugin';
import { DockButton } from './DockButton';

interface Props {
  manifestUrl: string;
  onLoad?: () => void;
}

export function Plugin({ manifestUrl, onLoad }: Props) {
  const { data: plugin } = useGetPlugin(manifestUrl);

  if (!plugin) return null;

  return (
    <PopupState variant="popover" popupId={plugin.id}>
      {(popupState) => (
        <>
          <Tooltip title={plugin.name}>
            <DockButton active={popupState.isOpen} {...bindToggle(popupState)}>
              <img src={plugin.icon} alt={plugin.name} width={32} height={32} />
            </DockButton>
          </Tooltip>

          <Popper {...bindPopper(popupState)} keepMounted transition placement="top-end">
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper sx={{ mb: '18px', lineHeight: 0, overflow: 'hidden' }}>
                  <Box
                    component="iframe"
                    key={plugin.id}
                    title={plugin.name}
                    src={plugin.plugin_url}
                    onLoad={onLoad}
                    sx={{ border: 'none', width: plugin.iframe?.width, height: plugin.iframe?.height }}
                  />
                </Paper>
              </Fade>
            )}
          </Popper>
        </>
      )}
    </PopupState>
  );
}
