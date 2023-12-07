import { yupResolver } from '@hookform/resolvers/yup';
import { Close, Info } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
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
import { toast } from 'react-hot-toast';
import * as yup from 'yup';

import { updateProfile, updateUser } from '../../app/auth/actions';
import { createMedia, deleteStorageObject, getObjectId } from '../../app/dashboard/actions';
import { useGetProfile } from '../../hooks/data/auth/useGetProfile';
import { useGetUser } from '../../hooks/data/auth/useGetUser';
import { MediaEntity } from '../../lib/types';
import { store } from '../../store';
import { UploadedFile } from '../../store/media';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledPasswordField } from '../form/ControlledPasswordField';
import { ControlledTextField } from '../form/ControlledTextField';
import { ControlledImageUploader } from '../form/ImageUploader/ControlledImageUploader';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsModal = observer(function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { data: user } = useGetUser();
  const { data: profile } = useGetProfile();

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  // Setup form validation schema
  const schema = yup
    .object()
    .shape(
      {
        name: ValidateUtils.Name,
        display_name: ValidateUtils.Name,
        email: ValidateUtils.Email,
        avatar: yup
          .mixed<UploadedFile | MediaEntity>()
          .test('isUppyFileOrMedia', 'Invalid avatar', (value) => {
            if (!value) return true;
            return store.media.isUploadedFile(value) || store.media.isMedia(value);
          })
          .nullable(),
        password: yup
          .string()
          .trim()
          .when('password', {
            is: (password: string) => password && password.length > 0,
            then: () => yup.string().min(8, 'Password must have at least 8 characters'),
          }),
        confirmPassword: yup
          .string()
          .trim()
          .when('password', {
            is: (password: string) => (password && password.length > 0 ? true : false),
            then: () =>
              yup
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
    defaultValues: {
      name: profile?.name,
      display_name: profile?.display_name,
      avatar: profile?.avatar,
      email: user?.email,
      password: '',
      confirmPassword: '',
    },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  // Reset the form when the map changes
  useEffect(() => {
    reset({
      name: profile?.name,
      display_name: profile?.display_name,
      avatar: profile?.avatar,
      email: user?.email,
      password: '',
      confirmPassword: '',
    });
  }, [user, profile, reset, store.dashboard.settingsModalOpen]);

  /**
   * Handle the form submission
   * @param values - The map values
   */
  async function handleSubmitForm(values: Schema) {
    if (!user || !profile) return;

    // Create the avatar
    if (values.avatar && store.media.isUploadedFile(values.avatar)) {
      // Get the normalized file from Uppy
      const file = await store.media.convertUppyToFile(values.avatar);

      // Get the uploaded storage object's ID to use as the media ID foreign key
      const objectId = await getObjectId(file.url);
      if (!objectId) {
        toast.error('Failed to upload avatar');
        return;
      }

      // Create the media entity
      const media = await createMedia({
        id: objectId,
        url: file.url,
        width: file.width,
        height: file.height,
        size: file.size,
      });

      // Update the avatar with the final media entity
      values.avatar = media;

      // Delete the previous avatar if it exists
      if (profile.avatar) {
        deleteStorageObject(profile.avatar.url);
      }
    }

    if (values.email !== user.email) {
      await updateUser({ email: values.email });
      toast.success('Email updated. Please check your inbox for a confirmation email.');
    }

    if (values.password) {
      await updateUser({ password: values.password });
    }

    await updateProfile({
      id: profile.id,
      name: values.name,
      display_name: values.display_name,
      avatar_id: values.avatar?.id,
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
              <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                Avatar
              </Typography>

              <ControlledImageUploader name="avatar" />
            </Box>

            <Typography variant="h6">Account</Typography>

            <Grid container spacing={2} alignItems="flex-start" sx={{ mt: -2 }}>
              <Grid item xs={12} sm={6}>
                <ControlledTextField
                  name="name"
                  label="Name"
                  sx={{ my: 1 }}
                  autoFocus
                  fullWidth
                  required
                  autoComplete="name"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ControlledTextField
                  name="display_name"
                  label="Display Name"
                  autoComplete="nickname"
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

            <ControlledTextField
              name="email"
              label="Email"
              sx={{ my: 1 }}
              fullWidth
              required
              disabled={Boolean(user?.new_email)}
              autoComplete="email"
            />

            {user?.new_email && (
              <Alert severity="info">
                You&apos;ve requested to change your email address to {user.new_email}. Please check your inbox for a
                confirmation email.
              </Alert>
            )}

            <Typography variant="h6" sx={{ mt: 4 }}>
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