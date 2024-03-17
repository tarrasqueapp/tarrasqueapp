import { zodResolver } from '@hookform/resolvers/zod';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { Map, createMap, updateMap } from '@/actions/maps';
import { Media, createMedia } from '@/actions/media';
import { deleteStorageObject, getObjectId } from '@/actions/storage';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ControlledMediaUploader } from '@/components/form/uploader/ControlledMediaUploader';
import { useGetUserCampaignMemberships } from '@/hooks/data/campaigns/memberships/useGetUserCampaignMemberships';
import { useGetMap } from '@/hooks/data/maps/useGetMap';
import { validation } from '@/lib/validation';
import { useMapStore } from '@/store/map';
import { MediaUtils } from '@/utils/MediaUtils';

interface CreateUpdateMapModalProps {
  open: boolean;
  onClose: () => void;
  mapId?: string;
  campaignId?: string;
}

export function CreateUpdateMapModal({ open, onClose, mapId, campaignId }: CreateUpdateMapModalProps) {
  const { data: map } = useGetMap(mapId);
  const { data: campaignMemberships } = useGetUserCampaignMemberships({ role: 'GAME_MASTER' });
  const queryClient = useQueryClient();

  const modal = useMapStore((state) => state.modal);

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  // Setup form validation schema
  const schema = z.object({
    name: z.string().min(1),
    campaign_id: z.string().min(1),
    media: z
      .union([validation.fields.uppyFile, validation.fields.media])
      .nullable()
      .refine(
        (value) => {
          if (!value) return false;
          return MediaUtils.isUploadedFile(value) || MediaUtils.isMedia(value);
        },
        {
          message: 'Invalid media',
        },
      ),
  });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: map || { name: '', campaign_id: campaignId, media: undefined },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  // Reset the form when the map changes
  useEffect(() => {
    reset(map || { name: '', campaign_id: campaignId, media: undefined });
  }, [map, reset, modal]);

  /**
   * Handle the form submission
   * @param values - The map values
   */
  async function handleSubmitForm(values: Schema) {
    if (!campaignId) return;

    // Create the media
    if (values.media && MediaUtils.isUploadedFile(values.media)) {
      // Get the normalized file from Uppy
      const file = await MediaUtils.convertUppyToFile(values.media);

      // Get the uploaded storage object's ID to use as the media ID foreign key
      const { data: objectId } = await getObjectId(file.url);
      if (!objectId) {
        toast.error('Failed to upload media');
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

      // Update the media with the final media entity
      values.media = mediaResponse.data!;

      // Delete the previous media if it exists
      if (map?.media) {
        deleteStorageObject({ url: map.media.url });
      }
    }

    const response = map
      ? await updateMap({
          id: map.id,
          name: values.name,
          campaign_id: values.campaign_id,
          media_id: (values.media as Media)?.id,
        })
      : await createMap({
          name: values.name,
          campaign_id: campaignId,
          media_id: (values.media as Media)?.id,
        });

    if (response.error) {
      toast.error(response.error);
      return;
    }

    // If campaign changed, remove the map from the previous campaign
    if (map && map.campaign_id !== values.campaign_id) {
      queryClient.setQueryData(['campaigns', map.campaign_id, 'maps'], (old: Map[] | undefined) => {
        if (!old) return old;
        return old.filter((m) => m.id !== map.id);
      });
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
            <span>{mapId ? 'Update Map' : 'Create Map'}</span>

            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <ControlledTextField name="name" label="Name" sx={{ my: 1 }} autoFocus fullWidth />

            {Boolean(campaignMemberships && map) && (
              <ControlledTextField name="campaign_id" label="Campaign" sx={{ my: 1 }} fullWidth select>
                {campaignMemberships!.map((membership) => (
                  <MenuItem key={membership.campaign_id} value={membership.campaign_id}>
                    {membership.campaign?.name}
                  </MenuItem>
                ))}
              </ControlledTextField>
            )}

            <Box sx={{ my: 1 }}>
              <ControlledMediaUploader name="media" />
            </Box>
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
