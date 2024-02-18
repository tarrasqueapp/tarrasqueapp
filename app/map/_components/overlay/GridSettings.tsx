import { Grid4x4, HexagonOutlined } from '@mui/icons-material';
import { Box, Fade, Paper, Popper, ToggleButton, ToggleButtonGroup, Tooltip, alpha } from '@mui/material';
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { useGetMemberships } from '@/hooks/data/campaigns/memberships/useGetMemberships';
import { useGetCampaign } from '@/hooks/data/campaigns/useGetCampaign';
import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { Color } from '@/lib/colors';

import { OverlayButtonGroup } from './OverlayButtonGroup';
import { ToolButton } from './Toolbar/ToolButton';

export function GridSettings() {
  const { data: user } = useGetUser();
  const { data: map } = useGetCurrentMap();
  const { data: campaign } = useGetCampaign(map?.campaign_id || '');
  const { data: memberships } = useGetMemberships(campaign?.id || '');

  const isGameMaster = memberships?.some(
    (membership) => membership.user_id === user?.id && membership.role === 'GAME_MASTER',
  );

  if (!isGameMaster) return null;

  return (
    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ background: alpha(Color.BLACK_LIGHT, 0.85) }}>
        <PopupState variant="popover" popupId="grid">
          {(popupState) => (
            <>
              <OverlayButtonGroup orientation="vertical" size="small">
                <Tooltip title="Grid" placement="left">
                  <ToolButton selected={popupState.isOpen} {...bindToggle(popupState)}>
                    <Grid4x4 />
                  </ToolButton>
                </Tooltip>
              </OverlayButtonGroup>

              <Popper {...bindPopper(popupState)} keepMounted transition placement="left-end">
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper sx={{ p: 1 }}>
                      <Box sx={{ border: 'none', width: 300, height: 300 }}>
                        <ToggleButtonGroup size="small" value="square">
                          <Tooltip title="Square">
                            <ToggleButton value="square">
                              <Grid4x4 />
                            </ToggleButton>
                          </Tooltip>

                          <Tooltip title="Hex (Horizontal)">
                            <ToggleButton value="hex-horizontal">
                              <HexagonOutlined />
                            </ToggleButton>
                          </Tooltip>

                          <Tooltip title="Hex (Vertical)">
                            <ToggleButton value="hex-vertical">
                              <HexagonOutlined sx={{ transform: 'rotate(90deg)' }} />
                            </ToggleButton>
                          </Tooltip>
                        </ToggleButtonGroup>
                      </Box>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </>
          )}
        </PopupState>
      </Paper>
    </Box>
  );
}
