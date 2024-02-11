import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box, Fade, IconButton, InputAdornment, Paper, Popper, SvgIcon, Tooltip } from '@mui/material';
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ControlledTextField } from '@/components/form/ControlledTextField';
import d4Icon from '@/public/images/app-icons/d4.svg';
import d6Icon from '@/public/images/app-icons/d6.svg';
import d8Icon from '@/public/images/app-icons/d8.svg';
import d10Icon from '@/public/images/app-icons/d10.svg';
import d12Icon from '@/public/images/app-icons/d12.svg';
import d20Icon from '@/public/images/app-icons/d20.svg';
import d100Icon from '@/public/images/app-icons/d100.svg';
import { useDiceStore } from '@/store/dice';

import { DockButton } from '../DockButton';
import { DiceRollerBackdrop } from './DiceRollerBackdrop';

export function DiceRoller() {
  const { setRolling, setNotation, setBackdropVisible } = useDiceStore();

  // Setup form validation schema
  const schema = z.object({
    notation: z.string(),
  });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({ mode: 'onChange', resolver: zodResolver(schema) });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const notationRef = useRef<HTMLInputElement | null>(null);

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
      console.error(error);
      methods.setError('notation', {
        type: 'manual',
        message: 'Invalid dice notation',
      });
    }
  }

  return (
    <>
      <PopupState variant="popper" popupId="dice-roller">
        {(popupState) => (
          <>
            <Tooltip title="Dice Roller">
              <DockButton {...bindToggle(popupState)} active={popupState.isOpen}>
                <SvgIcon component={d20Icon} sx={{ fontSize: '2rem' }} />
              </DockButton>
            </Tooltip>

            <Popper {...bindPopper(popupState)} transition disablePortal>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper sx={{ m: 2, ml: 1 }}>
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
                </Fade>
              )}
            </Popper>
          </>
        )}
      </PopupState>

      <DiceRollerBackdrop />
    </>
  );
}
