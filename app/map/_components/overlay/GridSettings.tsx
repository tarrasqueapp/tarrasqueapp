import { zodResolver } from '@hookform/resolvers/zod';
import { Close, Grid4x4, HexagonOutlined, HighlightAlt, Link, LinkOff, SquareOutlined } from '@mui/icons-material';
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
import { Color } from '@/lib/colors';
import { validate } from '@/lib/validate';

import { OverlayButtonGroup } from './OverlayButtonGroup';
import { ToolButton } from './Toolbar/ToolButton';

export function GridSettings() {
  const { data: user } = useGetUser();
  const { data: map } = useGetCurrentMap();
  const { data: campaign } = useGetCampaign(map?.campaign_id || '');
  const { data: memberships } = useGetMemberships(campaign?.id || '');
  const { data: grid } = useGetGrid(map?.id || '');
  const updateGrid = useUpdateGrid();

  const [constrainProportions, setConstrainProportions] = useState(true);
  const popupState = usePopupState({ variant: 'popper', popupId: 'grid' });

  // Setup form validation schema
  const schema = z.object({
    id: z.string().uuid(),
    type: validate.fields.gridType,
    width: z.number().min(5),
    height: z.number().min(5),
    offset_x: z.number(),
    offset_y: z.number(),
    color: z.string(),
    snap: z.boolean(),
    visible: z.boolean(),
    map_id: z.string().uuid(),
  });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({ mode: 'onChange', resolver: zodResolver(schema), defaultValues: grid });
  const { reset, setValue, watch } = methods;

  // Reset the form when the campaign changes
  useEffect(() => {
    reset(grid);
  }, [grid, reset]);

  const debouncedUpdate = useCallback(
    debounce((data: Schema) => {
      try {
        const isValid = schema.safeParse(data).success;
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
                      <Stack gap={1.3} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          Align Grid
                        </Typography>

                        <Button variant="contained" size="small">
                          <HighlightAlt />
                        </Button>
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
                          onClick={() => setConstrainProportions(!constrainProportions)}
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

                        <ColorPicker value={watch().color} onChange={(color) => setValue('color', color)} />
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
              </Paper>
            </Fade>
          )}
        </Popper>
      </Paper>
    </Box>
  );
}
