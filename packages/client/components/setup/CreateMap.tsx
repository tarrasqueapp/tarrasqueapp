import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateMap } from '../../hooks/data/maps/useCreateMap';
import { ControlledTextField } from '../form/ControlledTextField';

interface IProps {
  campaignId: string | undefined;
  onSubmit: () => void;
  onReset: () => void;
  isResetting: boolean;
}

export const CreateMap: React.FC<IProps> = ({ campaignId, onSubmit, onReset, isResetting }) => {
  const createMap = useCreateMap();

  // Setup form validation schema
  const schema = z.object({
    name: z.string().min(1),
    mediaId: z.string().min(1),
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
    await createMap.mutateAsync({ ...values, campaignId });
    onSubmit();
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ControlledTextField size="small" name="name" label="Name" sx={{ m: 1 }} />
          <ControlledTextField size="small" name="mediaId" label="Media" sx={{ m: 1 }} />
        </Box>

        <Box sx={{ mt: 2 }}>
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
