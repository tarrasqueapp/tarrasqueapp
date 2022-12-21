import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useCreateCampaign } from '../../hooks/data/campaigns/useCreateCampaign';
import { useUpdateSetup } from '../../hooks/data/setup/useUpdateSetup';
import { SetupStep } from '../../lib/types';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledTextField } from '../form/ControlledTextField';

interface CreateCampaignProps {
  onSubmit: () => void;
  onReset: () => void;
  isResetting: boolean;
}

export const CreateCampaign: React.FC<CreateCampaignProps> = ({ onSubmit, onReset, isResetting }) => {
  const createCampaign = useCreateCampaign();
  const updateSetup = useUpdateSetup();

  // Setup form validation schema
  const schema = yup
    .object({
      name: ValidateUtils.Name,
    })
    .required();
  type Schema = yup.InferType<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({ mode: 'onChange', resolver: yupResolver(schema) });
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
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
