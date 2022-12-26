import { yupResolver } from '@hookform/resolvers/yup';
import { Close, Info } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useCreateMedia } from '../../hooks/data/media/useCreateMedia';
import { useUpdateUser } from '../../hooks/data/users/useUpdateUser';
import { UserInterface } from '../../lib/types';
import { store } from '../../store';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledPasswordField } from '../form/ControlledPasswordField';
import { ControlledTextField } from '../form/ControlledTextField';
import { ControlledImageUploader } from '../form/ImageUploader/ControlledImageUploader';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  user?: UserInterface;
}

export const SettingsModal: React.FC<SettingsModalProps> = observer(({ open, onClose, user }) => {
  const createMedia = useCreateMedia();
  const updateUser = useUpdateUser();

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  // Setup form validation schema
  const schema = yup
    .object()
    .shape(
      {
        name: ValidateUtils.Name,
        email: ValidateUtils.Email,
        avatar: yup.mixed().test('isUppyFileOrMedia', 'Invalid avatar', (value) => {
          if (!value) return true;
          return store.media.isUploadedFile(value) || store.media.isMedia(value);
        }),
        password: yup
          .string()
          .trim()
          .when('password', {
            is: (password: string) => password && password.length > 0,
            then: yup.string().min(8, 'Password must have at least 8 characters'),
          }),
        confirmPassword: yup
          .string()
          .trim()
          .when('password', {
            is: (password: string) => (password && password.length > 0 ? true : false),
            then: yup
              .string()
              .trim()
              .required('Please confirm your password')
              .oneOf([yup.ref('password')], 'Passwords must match'),
          }),
      },
      [['password', 'password']],
    )
    .required();
  type Schema = yup.InferType<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { ...user, password: '', confirmPassword: '' },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  // Reset the form when the map changes
  useEffect(() => {
    reset({ ...user, password: '', confirmPassword: '' });
  }, [user, reset, store.dashboard.settingsModalOpen]);

  /**
   * Handle the form submission
   * @param values - The map values
   */
  async function handleSubmitForm(values: Schema) {
    // Create the avatar
    if (values.avatar && store.media.isUploadedFile(values.avatar)) {
      const file = await store.media.convertUppyToFile(values.avatar);
      values.avatar = await createMedia.mutateAsync(file);
    }

    // Update the user
    await updateUser.mutateAsync({
      name: values.name,
      displayName: values.displayName,
      avatarId: values.avatar?.id,
      ...(values.password && { password: values.password }),
    });

    onClose();
  }

  return (
    <Dialog fullScreen={fullScreen} fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          style={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto' }}
        >
          <DialogTitle>
            <span>Settings</span>

            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Box sx={{ my: 1, mx: 'auto', width: 200 }}>
              <Typography variant="h5" align="center" sx={{ mb: 1 }}>
                Avatar
              </Typography>

              <ControlledImageUploader name="avatar" />
            </Box>

            <Typography variant="h5">Account</Typography>

            <Grid container spacing={2} alignItems="flex-start" sx={{ mt: -1 }}>
              <Grid item xs={12} sm={6}>
                <ControlledTextField name="name" label="Name" sx={{ my: 1 }} autoFocus fullWidth required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ControlledTextField
                  name="displayName"
                  label="Display Name"
                  sx={{ my: 1 }}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Visible to everyone">
                          <Info />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <ControlledTextField name="email" label="Email" sx={{ my: 1 }} fullWidth required />

            <Typography variant="h5" sx={{ mt: 4 }}>
              Change Password
            </Typography>

            <Grid container spacing={2} alignItems="flex-start" sx={{ mt: -1 }}>
              <Grid item xs={12} sm={6}>
                <ControlledPasswordField name="password" label="New Password" autoComplete="new-password" fullWidth />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ControlledPasswordField
                  name="confirmPassword"
                  label="Confirm New Password"
                  autoComplete="new-password"
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>

            <LoadingButton loading={isSubmitting} disabled={!isValid} variant="contained" type="submit">
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
});
