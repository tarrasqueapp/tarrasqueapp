import { zodResolver } from '@hookform/resolvers/zod';
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
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { updateUser } from '@/actions/auth';
import { Media, createMedia } from '@/actions/media';
import { updateProfile } from '@/actions/profiles';
import { deleteStorageObject, getObjectId } from '@/actions/storage';
import { useGetProfile } from '@/hooks/data/auth/useGetProfile';
import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { validate } from '@/lib/validate';
import { MediaUtils } from '@/utils/MediaUtils';

import { ControlledTextField } from '../form/ControlledTextField';
import { ControlledAvatarUploader } from '../form/uploader/ControlledAvatarUploader';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { data: user } = useGetUser();
  const { data: profile } = useGetProfile();

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  // Setup form validation schema
  const schema = z.object({
    name: z.string().min(1),
    display_name: z.string().min(1),
    email: z.string().email().min(1),
    avatar: z
      .union([validate.fields.uppyFile, validate.fields.media])
      .nullable()
      .refine(
        (value) => {
          if (!value) return true;
          return MediaUtils.isUploadedFile(value) || MediaUtils.isMedia(value);
        },
        { message: 'Invalid avatar' },
      ),
  });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile?.name,
      display_name: profile?.display_name,
      avatar: profile?.avatar,
      email: user?.email,
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
    });
  }, [user, profile, reset, open]);

  /**
   * Handle the form submission
   * @param values - The map values
   */
  async function handleSubmitForm(values: Schema) {
    if (!user || !profile) return;

    try {
      // Create the avatar
      if (values.avatar && MediaUtils.isUploadedFile(values.avatar)) {
        // Get the normalized file from Uppy
        const file = await MediaUtils.convertUppyToFile(values.avatar);

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

      await updateProfile({
        name: values.name,
        display_name: values.display_name,
        avatar_id: (values.avatar as Media)?.id || null,
      });

      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
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

              <ControlledAvatarUploader name="avatar" />
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
}
