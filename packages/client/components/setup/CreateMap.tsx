import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateMap } from '../../hooks/data/maps/useCreateMap';
import { useCreateMedia } from '../../hooks/data/media/useCreateMedia';
import { ControlledTextField } from '../form/ControlledTextField';
import { ControlledUploader } from '../form/ControlledUploader';

interface IProps {
  campaignId: string | undefined;
  onSubmit: () => void;
  onReset: () => void;
  isResetting: boolean;
}

export const CreateMap: React.FC<IProps> = ({ campaignId, onSubmit, onReset, isResetting }) => {
  const createMap = useCreateMap();
  const createMedia = useCreateMedia();

  // Setup form validation schema
  const schema = z.object({
    name: z.string().min(1),
    file: z.object({
      name: z.string().min(1),
      type: z.string().min(1),
      extension: z.string().min(1),
      size: z.number().min(1),
      width: z.number(),
      height: z.number(),
    }),
  });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({ mode: 'onChange', resolver: zodResolver(schema) });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * Handle the form submission
   * @param values
   */
  async function handleSubmitForm(values: Schema) {
    const media = await createMedia.mutateAsync(values.file);
    await createMap.mutateAsync({ name: values.name, mediaId: media.id, campaignId });
    onSubmit();
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ControlledTextField size="small" name="name" label="Name" sx={{ my: 1 }} autoFocus />
          <Box sx={{ my: 1 }}>
            <ControlledUploader name="file" allowedFileTypes={['image/*', 'video/*']} />
          </Box>
        </Box>

        <Box sx={{ mt: 2, mb: 1 }}>
          <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ mr: 1 }}>
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
