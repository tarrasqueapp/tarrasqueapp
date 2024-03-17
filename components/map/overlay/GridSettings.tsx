import { zodResolver } from '@hookform/resolvers/zod';
import {
  Close,
  Grid4x4,
  HexagonOutlined,
  HighlightAlt,
  InfoOutlined,
  Link,
  LinkOff,
  SquareOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Fade,
  IconButton,
  Paper,
  Popper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  alpha,
  debounce,
} from '@mui/material';
import { bindPopper, bindToggle } from 'material-ui-popup-state';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { ColorPicker } from '@/components/color-picker/ColorPicker';
import { ControlledIOSSwitch } from '@/components/form/ControlledIOSSwitch';
import { ControlledNumberField } from '@/components/form/ControlledNumberField';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { useGetMemberships } from '@/hooks/data/campaigns/memberships/useGetMemberships';
import { useGetCampaign } from '@/hooks/data/campaigns/useGetCampaign';
import { useGetGrid } from '@/hooks/data/grids/useGetGrid';
import { useUpdateGrid } from '@/hooks/data/grids/useUpdateGrid';
import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { usePixiStore } from '@/store/usePixiStore';
import { Color } from '@/utils/colors';
import { validation } from '@/utils/validation';

import { OverlayButtonGroup } from './OverlayButtonGroup';
import { ToolButton } from './Toolbar/ToolButton';

export function GridSettings() {
  const { data: user } = useGetUser();
  const { data: map } = useGetCurrentMap();
  const { data: campaign } = useGetCampaign(map?.campaign_id);
  const { data: memberships } = useGetMemberships(campaign?.id);
  const { data: grid } = useGetGrid(map?.id);
  const updateGrid = useUpdateGrid();

  const [constrainProportions, setConstrainProportions] = useState(true);
  const popupState = usePopupState({ variant: 'popper', popupId: 'grid' });
  const aligningGrid = usePixiStore((state) => state.aligningGrid);
  const setAligningGrid = usePixiStore((state) => state.setAligningGrid);
  const viewport = usePixiStore((state) => state.viewport);

  // Setup form
  type Schema = z.infer<typeof validation.schemas.grids.updateGrid>;
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: zodResolver(validation.schemas.grids.updateGrid),
    defaultValues: grid,
  });
  const { reset, setValue, watch } = methods;

  // Reset the form when the campaign changes
  useEffect(() => {
    reset(grid);
  }, [grid, reset]);

  // Debounce the grid update function
  const debouncedUpdate = useCallback(
    debounce((data: Schema) => {
      try {
        const isValid = validation.schemas.grids.updateGrid.safeParse(data).success;
        console.log(data);
        if (!isValid) return;
        updateGrid.mutate(data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }, 500),
    [],
  );

  // Watch for changes to the form and update the grid
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        debouncedUpdate(methods.getValues());
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedUpdate, methods]);

  const isGameMaster = memberships?.some(
    (membership) => membership.user_id === user?.id && membership.role === 'GAME_MASTER',
  );

  /**
   * Zoom in to the top left corner of the map and enable grid alignment mode
   */
  function handleClickAlign() {
    if (!viewport || !map?.media?.width || !map?.media?.height) return;

    // Calculate the scale to zoom to
    const scale = Math.min(map.media.width / viewport.worldWidth, map.media.height / viewport.worldHeight) * 4;

    // Zoom to the top left corner of the map
    viewport.animate({
      position: { x: 100, y: 100 },
      scale,
      time: 100,
    });

    // Enable grid alignment mode
    setAligningGrid(true);
  }

  if (!isGameMaster) return null;

  return (
    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ background: alpha(Color.BLACK_LIGHT, 0.85) }}>
        <OverlayButtonGroup orientation="vertical" size="small">
          <Tooltip title="Grid" placement={popupState.isOpen ? 'bottom' : 'left'}>
            <ToolButton selected={popupState.isOpen} {...bindToggle(popupState)}>
              <Grid4x4 />
            </ToolButton>
          </Tooltip>
        </OverlayButtonGroup>

        <Popper {...bindPopper(popupState)} transition placement="left-start">
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper sx={{ mr: 0.5 }}>
                {aligningGrid && (
                  <>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    >
                      <Stack direction="row" alignItems="center" sx={{ flexGrow: 1, pl: 1, gap: 1 }}>
                        <HighlightAlt sx={{ fontSize: '1rem' }} />
                        <Typography variant="overline">Grid Alignment</Typography>
                      </Stack>

                      <Tooltip title="Close" placement="top">
                        <IconButton onClick={() => setAligningGrid(false)} sx={{ ml: 1 }}>
                          <Close fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <Divider />

                    <Box sx={{ p: 1.5, width: 300 }}>
                      <Typography paragraph>
                        <strong>Click and drag</strong> to draw a {watch().type === 'SQUARE' ? 'rectangle' : 'hexagon'}{' '}
                        over a single grid cell to calculate the dimensions and position of your map&apos;s grid.
                      </Typography>

                      <Typography paragraph>
                        When finished, you can manually adjust the grid settings to fine-tune the alignment.
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Press <strong>ESC</strong> or click the <strong>X</strong> button to exit grid alignment mode.
                      </Typography>
                    </Box>
                  </>
                )}

                {!aligningGrid && (
                  <>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    >
                      <Stack direction="row" alignItems="center" sx={{ flexGrow: 1, pl: 1, gap: 1 }}>
                        <Grid4x4 sx={{ fontSize: '1rem' }} />
                        <Typography variant="overline">Grid Settings</Typography>
                      </Stack>

                      <Tooltip title="Close" placement="top">
                        <IconButton onClick={() => popupState.close()} sx={{ ml: 1 }}>
                          <Close fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <Divider />

                    <FormProvider {...methods}>
                      <Stack gap={1.5} sx={{ p: 1.5, pb: 2, width: 300 }}>
                        <Stack gap={2} direction="row" justifyContent="space-evenly" sx={{ mb: 1 }}>
                          {/* Type */}
                          <Stack gap={1} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              Type
                            </Typography>

                            <ToggleButtonGroup size="small" value={watch().type}>
                              <Tooltip title="Square">
                                <ToggleButton value="SQUARE" onClick={() => setValue('type', 'SQUARE')}>
                                  <SquareOutlined />
                                </ToggleButton>
                              </Tooltip>

                              <Tooltip title="Hex (Horizontal)">
                                <ToggleButton value="HEX_HORIZONTAL" onClick={() => setValue('type', 'HEX_HORIZONTAL')}>
                                  <HexagonOutlined />
                                </ToggleButton>
                              </Tooltip>

                              <Tooltip title="Hex (Vertical)">
                                <ToggleButton value="HEX_VERTICAL" onClick={() => setValue('type', 'HEX_VERTICAL')}>
                                  <HexagonOutlined sx={{ transform: 'rotate(90deg)' }} />
                                </ToggleButton>
                              </Tooltip>
                            </ToggleButtonGroup>
                          </Stack>

                          {/* Align Grid */}
                          <Stack gap={1} alignItems="center">
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                              <span>Align Grid</span>

                              <Tooltip
                                title="Draw over a single grid cell to automatically set the grid dimensions and offsets"
                                placement="top"
                              >
                                <InfoOutlined fontSize="small" />
                              </Tooltip>
                            </Typography>

                            <Tooltip
                              title={watch().type !== 'SQUARE' ? 'Currently only available for square grids' : ''}
                            >
                              <span>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={handleClickAlign}
                                  disabled={watch().type !== 'SQUARE'}
                                >
                                  <HighlightAlt />
                                </Button>
                              </span>
                            </Tooltip>
                          </Stack>
                        </Stack>

                        {/* Width & Height */}
                        <Stack gap={0.5} direction="row" alignItems="center" justifyContent="space-between">
                          <ControlledNumberField
                            size="small"
                            name="width"
                            label="Width"
                            fullWidth
                            inputProps={{ min: 5 }}
                            onChange={(event) => {
                              // Convert value to number before updating the form state
                              const value = event.target.value ? parseFloat(event.target.value) : 0;
                              if (constrainProportions) {
                                setValue('height', value, { shouldValidate: true });
                              }
                              setValue('width', value, { shouldValidate: true });
                            }}
                          />

                          <Tooltip title="Constrain Proportions">
                            <IconButton
                              size="small"
                              onClick={() => {
                                const newValue = !constrainProportions;
                                setConstrainProportions(newValue);
                                if (newValue) {
                                  setValue('height', watch().width, { shouldValidate: true });
                                }
                              }}
                              color={constrainProportions ? 'primary' : 'default'}
                            >
                              {constrainProportions ? <Link /> : <LinkOff />}
                            </IconButton>
                          </Tooltip>

                          <ControlledNumberField
                            size="small"
                            name="height"
                            label="Height"
                            fullWidth
                            inputProps={{ min: 5 }}
                            onChange={(event) => {
                              // Convert value to number before updating the form state
                              const value = event.target.value ? parseFloat(event.target.value) : 0;
                              if (constrainProportions) {
                                setValue('width', value, { shouldValidate: true });
                              }
                              setValue('height', value, { shouldValidate: true });
                            }}
                          />
                        </Stack>

                        {/* Offset */}
                        <Stack gap={1.5} direction="row" justifyContent="space-between">
                          <ControlledNumberField size="small" name="offset_x" label="Left Offset" fullWidth />

                          <ControlledNumberField size="small" name="offset_y" label="Top Offset" fullWidth />
                        </Stack>

                        <Stack gap={2} direction="row" justifyContent="space-evenly" sx={{ mt: 0.5 }}>
                          {/* Snap to Grid */}
                          <Stack gap={1} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              Snap to Grid
                            </Typography>

                            <ControlledIOSSwitch name="snap" />
                          </Stack>

                          {/* Visible */}
                          <Stack gap={1} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              Visible
                            </Typography>

                            <ControlledIOSSwitch name="visible" />
                          </Stack>

                          {/* Color */}
                          <Stack alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              Color
                            </Typography>

                            <ColorPicker value={watch().color!} onChange={(color) => setValue('color', color)} />
                          </Stack>
                        </Stack>

                        {/* Distance */}
                        <Stack gap={1.5} direction="row" justifyContent="space-between">
                          <ControlledTextField
                            size="small"
                            name="distance"
                            label="Distance"
                            // type="number"
                            fullWidth
                            value="5 ft"
                          />
                        </Stack>

                        {/* Measurement */}
                        <Stack gap={1.5} direction="row" justifyContent="space-between">
                          <ControlledTextField size="small" name="measurement" label="Measurement" fullWidth />
                        </Stack>
                      </Stack>
                    </FormProvider>
                  </>
                )}
              </Paper>
            </Fade>
          )}
        </Popper>
      </Paper>
    </Box>
  );
}
