import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateCampaign } from '../../hooks/data/campaigns/useCreateCampaign';
import { useUpdateSetup } from '../../hooks/data/setup/useUpdateSetup';
import { SetupStep } from '../../lib/types';
import { ControlledTextField } from '../form/ControlledTextField';

interface IProps {
  onSubmit: () => void;
  onReset: () => void;
  isResetting: boolean;
}

export const CreateCampaign: React.FC<IProps> = ({ onSubmit, onReset, isResetting }) => {
  const createCampaign = useCreateCampaign();
  const updateSetup = useUpdateSetup();

  // Setup form validation schema
  const schema = z.object({
    name: z.string().min(1),
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
   * @param values - The campaign values
   */
  async function handleSubmitForm(values: Schema) {
    await createCampaign.mutateAsync(values);
    await updateSetup.mutateAsync({ step: SetupStep.MAP });
    onSubmit();
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ControlledTextField size="small" name="name" label="Name" sx={{ my: 1 }} autoFocus />
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
