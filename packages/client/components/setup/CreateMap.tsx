import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useCreateMap } from '../../hooks/data/maps/useCreateMap';
import { useCreateMedia } from '../../hooks/data/media/useCreateMedia';
import { useUpdateSetup } from '../../hooks/data/setup/useUpdateSetup';
import { SetupStep } from '../../lib/types';
import { store } from '../../store';
import { UploadedFile } from '../../store/media';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledTextField } from '../form/ControlledTextField';
import { ControlledMediaUploader } from '../form/MediaUploader/ControlledMediaUploader';

interface CreateMapProps {
  campaignId: string | undefined;
  onSubmit: () => void;
  onReset: () => void;
  isResetting: boolean;
}

export const CreateMap: React.FC<CreateMapProps> = ({ campaignId, onSubmit, onReset, isResetting }) => {
  const createMap = useCreateMap();
  const createMedia = useCreateMedia();
  const updateSetup = useUpdateSetup();

  // Setup form validation schema
  const schema = yup
    .object({
      name: ValidateUtils.Name,
      media: yup
        .mixed()
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
  const methods = useForm<Schema>({ mode: 'onChange', resolver: yupResolver(schema) });
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    watch,
    setValue,
  } = methods;

  /**
   * Handle the form submission
   * @param values - The map values
   */
  async function handleSubmitForm(values: Schema) {
    // Create new media
    const media = await Promise.all(
      values.media
        .filter((file: UploadedFile) => store.media.isUploadedFile(file))
        .map(async (uppyFile: UploadedFile) => {
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
      mediaIds: media.map((media) => media.id),
      campaignId,
      selectedMediaId: values.selectedMediaId,
    });
    await updateSetup.mutateAsync({ step: SetupStep.COMPLETED, completed: true });
    onSubmit();
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ControlledTextField name="name" label="Name" sx={{ my: 1 }} autoFocus />

          <Box sx={{ my: 1 }}>
            <ControlledMediaUploader
              name="media"
              selectedMediaId={selectedMediaId}
              onSelect={(file) => setValue('selectedMediaId', file?.id, { shouldValidate: true })}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 2, mb: 1 }}>
          <LoadingButton loading={isSubmitting} disabled={!isValid} variant="contained" type="submit" sx={{ mr: 1 }}>
            Continue
          </LoadingButton>

          <LoadingButton loading={isResetting} onClick={onReset}>
            Reset
          </LoadingButton>
        </Box>
      </form>
    </FormProvider>
  );
};
