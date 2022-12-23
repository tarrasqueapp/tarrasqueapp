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
  Theme,
  useMediaQuery,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useCreateMap } from '../../hooks/data/maps/useCreateMap';
import { useUpdateMap } from '../../hooks/data/maps/useUpdateMap';
import { useCreateMedia } from '../../hooks/data/media/useCreateMedia';
import { MapFactory } from '../../lib/factories/MapFactory';
import { CampaignInterface, MapInterface, MediaInterface } from '../../lib/types';
import { store } from '../../store';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { UploadedMedia } from '../common/UploadedMedia';
import { ControlledTextField } from '../form/ControlledTextField';
import { ControlledUploader } from '../form/ControlledUploader';
import { FileUpload } from '../form/Uploader/Uploader';

interface CreateUpdateMapModalProps {
  open: boolean;
  onClose: () => void;
  map: MapInterface | null;
  campaign: CampaignInterface | null;
}

export const CreateUpdateMapModal: React.FC<CreateUpdateMapModalProps> = observer(
  ({ open, onClose, map, campaign }) => {
    const createMap = useCreateMap();
    const createMedia = useCreateMedia();
    const updateMap = useUpdateMap();

    const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    // Setup form validation schema
    const schema = yup
      .object({
        name: ValidateUtils.Name,
        files: yup
          .array(ValidateUtils.UppyFile)
          .min(map ? 0 : 1)
          .required(),
        media: yup
          .array(ValidateUtils.Media)
          .when('files', {
            is: (files: FileUpload[]) => !files?.length,
            then: yup.array().min(1),
          })
          .required(),
        selectedMediaId: yup.string(),
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
        const existingMedia = values.media || [];
        // Find new files that needs to be created as media
        const newMedia = await Promise.all(
          values.files.map(async (uppyFile) => {
            const file = await store.media.convertUppyToFile(uppyFile);
            const media = await createMedia.mutateAsync(file);
            if (file.id === values.selectedMediaId) {
              values.selectedMediaId = media.id;
            }
            return media;
          }),
        );
        // Merge existing and new media
        const media = [...existingMedia, ...newMedia] as MediaInterface[];
        // Update map
        await updateMap.mutateAsync({
          name: values.name,
          id: map.id,
          campaignId: campaign.id,
          ...(media.length > 0 && { mediaIds: media.map((media) => media.id) }),
          selectedMediaId: values.selectedMediaId,
        });
        onClose();
        return;
      }

      // Create new media
      const media = await Promise.all(
        values.files.map(async (uppyFile) => {
          const file = await store.media.convertUppyToFile(uppyFile);
          const media = await createMedia.mutateAsync(file);
          if (file.id === values.selectedMediaId) {
            values.selectedMediaId = media.id;
          }
          return media;
        }),
      );
      // Create map
      await createMap.mutateAsync({
        name: values.name,
        mediaIds: media.map((media) => media.id),
        campaignId: campaign.id,
        selectedMediaId: values.selectedMediaId,
      });
      onClose();
    }

    const files = watch('files');
    const media = watch('media');
    useEffect(() => {
      // Only run there is no media
      if (!files?.length || media?.length) return;
      const lastFile = files[files.length - 1];
      if (!lastFile.uploadURL) return;
      const fileName = store.media.getFileNameFromUploadUrl(lastFile.uploadURL);
      setValue('selectedMediaId', fileName, { shouldValidate: true });
    }, [files, media]);

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
              <ControlledTextField size="small" name="name" label="Name" sx={{ my: 1 }} autoFocus fullWidth />

              <Box sx={{ my: 1 }}>
                <ControlledUploader
                  name="files"
                  allowedFileTypes={['image/*', 'video/*']}
                  multiple
                  FileListProps={{
                    selectable: true,
                    selectedFileId: watch('selectedMediaId'),
                    onSelect: (file) => {
                      if (!file.uploadURL) return;
                      const fileName = store.media.getFileNameFromUploadUrl(file.uploadURL);
                      setValue('selectedMediaId', fileName, { shouldValidate: true });
                    },
                  }}
                />
              </Box>

              <UploadedMedia
                media={watch('media') as MediaInterface[]}
                selectedMediaId={watch('selectedMediaId')}
                onSelect={(media) => setValue('selectedMediaId', media.id, { shouldValidate: true })}
                onDelete={(media) => {
                  const existingMedia = watch('media') as MediaInterface[];
                  setValue(
                    'media',
                    existingMedia.filter((existingMedia) => existingMedia.id !== media.id),
                    { shouldValidate: true },
                  );
                }}
              />
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
  },
);
