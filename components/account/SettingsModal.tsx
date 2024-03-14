import { zodResolver } from '@hookform/resolvers/zod';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Theme,
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
import { validation } from '@/lib/validation';
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
    email: z.string().email().min(1),
    avatar: z
      .union([validation.fields.uppyFile, validation.fields.media])
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

    // Create the avatar
    if (values.avatar && MediaUtils.isUploadedFile(values.avatar)) {
      // Get the normalized file from Uppy
      const file = await MediaUtils.convertUppyToFile(values.avatar);

      // Get the uploaded storage object's ID to use as the media ID foreign key
      const { data: objectId } = await getObjectId(file.url);
      if (!objectId) {
        toast.error('Failed to upload avatar');
        return;
      }

      // Create the media entity
      const mediaResponse = await createMedia({
        id: objectId,
        url: file.url,
        width: file.width,
        height: file.height,
        size: file.size,
      });

      if (mediaResponse.error) {
        toast.error(mediaResponse.error);
        return;
      }

      // Update the avatar with the final media entity
      values.avatar = mediaResponse.data!;

      // Delete the previous avatar if it exists
      if (profile.avatar) {
        deleteStorageObject({ url: profile.avatar.url });
      }
    }

    if (values.email !== user.email) {
      const response = await updateUser({ email: values.email });

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Email updated. Please check your inbox for a confirmation email.');
    }

    const response = await updateProfile({
      name: values.name,
      avatar_id: (values.avatar as Media)?.id || null,
    });

    if (response?.error) {
      toast.error(response.error);
      return;
    }

    onClose();
  }

  return (
    <Dialog fullScreen={fullScreen} fullWidth maxWidth="xs" onClose={onClose} open={open}>
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
            <Box sx={{ mt: 1, mb: 2, mx: 'auto', width: 200 }}>
              <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                Avatar
              </Typography>

              <ControlledAvatarUploader name="avatar" />
            </Box>

            <Typography variant="h6">Account</Typography>

            <ControlledTextField
              name="name"
              label="Name"
              sx={{ my: 1 }}
              autoFocus
              fullWidth
              required
              autoComplete="fname"
            />

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
              <Alert severity="info" variant="outlined">
                You&apos;ve requested to change your email address to {user.new_email}. Please check your inbox for a
                confirmation email.
              </Alert>
            )}
          </DialogContent>

          <DialogActions>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>

            <LoadingButton loading={isSubmitting} disabled={!isValid} variant="contained" type="submit">
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
