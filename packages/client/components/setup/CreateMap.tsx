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
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledTextField } from '../form/ControlledTextField';
import { ControlledUploader } from '../form/ControlledUploader';

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
      files: yup.array(ValidateUtils.UppyFile).min(1).required(),
      selectedMediaId: yup.string(),
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
      campaignId,
      selectedMediaId: values.selectedMediaId,
    });
    await updateSetup.mutateAsync({ step: SetupStep.COMPLETED, completed: true });
    onSubmit();
  }

  const files = watch('files');
  useEffect(() => {
    // Only run there is no media
    if (!files?.length) return;
    const lastFile = files[files.length - 1];
    if (!lastFile.uploadURL) return;
    const fileName = store.media.getFileNameFromUploadUrl(lastFile.uploadURL);
    setValue('selectedMediaId', fileName, { shouldValidate: true });
  }, [files]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ControlledTextField name="name" label="Name" sx={{ my: 1 }} autoFocus />

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
