import { yupResolver } from '@hookform/resolvers/yup';
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
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { CampaignEntity, MapEntity, MediaEntity, Role } from '@tarrasque/common';

import { useGetUser } from '../../hooks/data/auth/useGetUser';
import { useGetUserCampaigns } from '../../hooks/data/campaigns/useGetUserCampaigns';
import { useCreateMap } from '../../hooks/data/maps/useCreateMap';
import { useUpdateMap } from '../../hooks/data/maps/useUpdateMap';
import { useCreateMedia } from '../../hooks/data/media/useCreateMedia';
import { MapFactory } from '../../lib/factories/MapFactory';
import { store } from '../../store';
import { UploadedFile } from '../../store/media';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledTextField } from '../form/ControlledTextField';
import { ControlledMediaUploader } from '../form/MediaUploader/ControlledMediaUploader';

interface CreateUpdateMapModalProps {
  open: boolean;
  onClose: () => void;
  map: MapEntity | undefined;
  campaign: CampaignEntity | undefined;
}

export const CreateUpdateMapModal = observer(function CreateUpdateMapModal({
  open,
  onClose,
  map,
  campaign,
}: CreateUpdateMapModalProps) {
  const { data: campaigns } = useGetUserCampaigns();
  const { data: user } = useGetUser();
  const createMap = useCreateMap();
  const createMedia = useCreateMedia();
  const updateMap = useUpdateMap();
  const queryClient = useQueryClient();

  // Get campaigns where the user is a GM
  const gmCampaigns =
    campaigns?.filter((campaign) =>
      campaign.memberships.some((membership) => membership.userId === user?.id && membership.role === Role.GAME_MASTER),
    ) || [];

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  // Setup form validation schema
  const schema = yup
    .object({
      name: ValidateUtils.Name,
      campaignId: yup.string().when('campaign', {
        is: (campaign: CampaignEntity | undefined) => Boolean(campaign),
        then: () => yup.string().required(),
      }),
      media: yup
        .mixed<(UploadedFile | MediaEntity)[]>()
        .test('isUppyFileOrMedia', 'Invalid media', (value) => {
          if (!value || !Array.isArray(value) || !value.length) return false;
          return value.every((file) => store.media.isUploadedFile(file) || store.media.isMedia(file));
        })
        .required(),
      selectedMediaId: yup.string().required(),
    })
    .required();
  type Schema = yup.InferType<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: map || new MapFactory(),
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
    watch,
    setValue,
  } = methods;

  // Reset the form when the map changes
  useEffect(() => {
    reset(map || new MapFactory());
  }, [map, reset, store.maps.modal]);

  /**
   * Handle the form submission
   * @param values - The map values
   */
  async function handleSubmitForm(values: Schema) {
    if (!campaign) return;

    if (map) {
      // Get existing media
      const existingMedia = values.media.filter((media) => store.media.isMedia(media));
      // Find new files that needs to be created as media
      const newMedia = await Promise.all(
        values.media
          .filter((file): file is UploadedFile => store.media.isUploadedFile(file))
          .map(async (uppyFile) => {
            const file = await store.media.convertUppyToFile(uppyFile);
            const media = await createMedia.mutateAsync(file);
            if (values.selectedMediaId === uppyFile.id) {
              values.selectedMediaId = media.id;
            }
            return media;
          }),
      );
      // Merge existing and new media
      const media = [...existingMedia, ...newMedia] as MediaEntity[];
      // Update map
      await updateMap.mutateAsync({
        name: values.name,
        id: map.id,
        campaignId: values.campaignId,
        ...(media.length > 0 && { mediaIds: media.map((media) => media.id) }),
        selectedMediaId: values.selectedMediaId,
      });
      if (values.campaignId !== map.campaignId) {
        queryClient.invalidateQueries({ queryKey: ['campaigns', map.campaignId, 'maps'] });
      }
      onClose();
      return;
    }

    // Create new media
    const media = await Promise.all(
      values.media
        .filter((file): file is UploadedFile => store.media.isUploadedFile(file))
        .map(async (uppyFile) => {
          const file = await store.media.convertUppyToFile(uppyFile);
          const media = await createMedia.mutateAsync(file);
          if (values.selectedMediaId === uppyFile.id) {
            values.selectedMediaId = media.id;
          }
          return media;
        }),
    );
    // Create map
    await createMap.mutateAsync({
      name: values.name,
      campaignId: campaign.id,
      mediaIds: media.map((media) => media.id),
      selectedMediaId: values.selectedMediaId,
    });
    onClose();
  }

  const media = watch('media');
  const selectedMediaId = watch('selectedMediaId');
  useEffect(() => {
    if (selectedMediaId || !media?.length) return;
    const firstMedia = media[media.length - 1];
    if (!firstMedia) return;
    setValue('selectedMediaId', firstMedia.id, { shouldValidate: true });
  }, [media]);

  return (
    <Dialog fullScreen={fullScreen} fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          style={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto' }}
        >
          <DialogTitle>
            <span>{map ? 'Update Map' : 'Create Map'}</span>

            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <ControlledTextField name="name" label="Name" sx={{ my: 1 }} autoFocus fullWidth />

            {map && (
              <ControlledTextField name="campaignId" label="Campaign" sx={{ my: 1 }} fullWidth select>
                {gmCampaigns.map((campaign) => (
                  <MenuItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </MenuItem>
                ))}
              </ControlledTextField>
            )}

            <Box sx={{ my: 1 }}>
              <ControlledMediaUploader
                name="media"
                selectedMediaId={selectedMediaId}
                onSelect={(file) => setValue('selectedMediaId', file?.id, { shouldValidate: true })}
              />
            </Box>
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
