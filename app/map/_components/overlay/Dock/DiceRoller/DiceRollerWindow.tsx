import { zodResolver } from '@hookform/resolvers/zod';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, InputAdornment, Paper, Stack, SvgIcon, Tooltip, Typography } from '@mui/material';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Draggable } from '@/components/draggable/Draggable';
import { DraggableHandle } from '@/components/draggable/DraggableHandle';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { logger } from '@/lib/logger';
import d4Icon from '@/public/images/app-icons/d4.svg';
import d6Icon from '@/public/images/app-icons/d6.svg';
import d8Icon from '@/public/images/app-icons/d8.svg';
import d10Icon from '@/public/images/app-icons/d10.svg';
import d12Icon from '@/public/images/app-icons/d12.svg';
import d20Icon from '@/public/images/app-icons/d20.svg';
import d100Icon from '@/public/images/app-icons/d100.svg';
import { useDiceStore } from '@/store/dice';
import { AnchorPoint, NativeDraggable, useDraggableStore } from '@/store/draggable';

export function DiceRollerWindow() {
  const setRolling = useDiceStore((state) => state.setRolling);
  const setNotation = useDiceStore((state) => state.setNotation);
  const setBackdropVisible = useDiceStore((state) => state.setBackdropVisible);
  const toggleVisibility = useDraggableStore((state) => state.toggleVisibility);

  // Setup form validation schema
  const schema = z.object({ notation: z.string() });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({ mode: 'onChange', resolver: zodResolver(schema) });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const notationRef = useRef<HTMLInputElement | null>(null);

  /**
   * Toggle the dice roller window visibility
   */
  function handleToggleDiceRoller() {
    toggleVisibility(NativeDraggable.DICE_ROLLER);
  }

  /**
   * Add selected dice type to input notation
   * @param dice
   */
  function addToNotation(dice: string) {
    const notation = methods.watch('notation');
    const append = notation ? notation + '+' : '';
    const value = append + dice;

    methods.setValue('notation', value, { shouldValidate: true, shouldDirty: true });
    notationRef.current?.focus();
  }

  /**
   * Trigger dice roll of selected notation
   * @param data
   */
  function handleSubmitForm(data: { notation: string }) {
    if (!data.notation) return;

    try {
      setNotation(data.notation);
      setRolling(true);
      setBackdropVisible(true);
      methods.setValue('notation', '');
      notationRef.current?.blur();
    } catch (error) {
      logger.error(error);
      methods.setError('notation', {
        type: 'manual',
        message: 'Invalid dice notation',
      });
    }
  }

  return (
    <Draggable id={NativeDraggable.DICE_ROLLER} anchorPoint={AnchorPoint.BOTTOM_LEFT}>
      <Paper>
        <DraggableHandle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <Stack direction="row" alignItems="center" sx={{ flexGrow: 1, pl: 1, gap: 1 }}>
              <SvgIcon component={d20Icon} sx={{ fontSize: '1rem' }} />
              <Typography variant="overline">Dice Roller</Typography>
            </Stack>

            <Tooltip title="Close" placement="top">
              <IconButton onClick={handleToggleDiceRoller} sx={{ ml: 1 }}>
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Divider />
        </DraggableHandle>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, overflow: 'auto' }}>
              <Tooltip title="1d4" placement="top">
                <IconButton onClick={() => addToNotation('1d4')}>
                  <SvgIcon component={d4Icon} />
                </IconButton>
              </Tooltip>

              <Tooltip title="1d6" placement="top">
                <IconButton onClick={() => addToNotation('1d6')}>
                  <SvgIcon component={d6Icon} />
                </IconButton>
              </Tooltip>

              <Tooltip title="1d8" placement="top">
                <IconButton onClick={() => addToNotation('1d8')}>
                  <SvgIcon component={d8Icon} />
                </IconButton>
              </Tooltip>

              <Tooltip title="1d10" placement="top">
                <IconButton onClick={() => addToNotation('1d10')}>
                  <SvgIcon component={d10Icon} />
                </IconButton>
              </Tooltip>

              <Tooltip title="1d12" placement="top">
                <IconButton onClick={() => addToNotation('1d12')}>
                  <SvgIcon component={d12Icon} />
                </IconButton>
              </Tooltip>

              <Tooltip title="1d20" placement="top">
                <IconButton onClick={() => addToNotation('1d20')}>
                  <SvgIcon component={d20Icon} />
                </IconButton>
              </Tooltip>

              <Tooltip title="1d100" placement="top">
                <IconButton onClick={() => addToNotation('1d100')}>
                  <SvgIcon component={d100Icon} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', p: 1, pt: 0 }}>
              <ControlledTextField
                name="notation"
                label="Dice Notation"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ mr: -0.75 }}>
                      <LoadingButton
                        loading={isSubmitting}
                        variant="contained"
                        type="submit"
                        sx={{ borderRadius: '10px' }}
                      >
                        Roll
                      </LoadingButton>
                    </InputAdornment>
                  ),
                }}
                inputRef={notationRef}
                autoFocus
                autoComplete="off"
                fullWidth
                onKeyDown={(event) => {
                  if (event.key === 'Escape' && event.target instanceof HTMLInputElement) {
                    event.target.blur();
                  }
                }}
              />
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Draggable>
  );
}
