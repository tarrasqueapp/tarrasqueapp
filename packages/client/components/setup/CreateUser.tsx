import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useCreateSetupUser } from '../../hooks/data/setup/useCreateSetupUser';
import { useUpdateSetup } from '../../hooks/data/setup/useUpdateSetup';
import { useSignIn } from '../../hooks/data/users/useSignIn';
import { SetupStep } from '../../lib/types';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledTextField } from '../form/ControlledTextField';

interface CreateUserProps {
  onSubmit: () => void;
}

export const CreateUser: React.FC<CreateUserProps> = ({ onSubmit }) => {
  const createSetupUser = useCreateSetupUser();
  const signIn = useSignIn();
  const updateSetup = useUpdateSetup();

  // Setup form validation schema
  const schema = yup
    .object({
      name: ValidateUtils.Name,
      email: ValidateUtils.Email,
      password: ValidateUtils.Password,
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
   * @param values - The user values
   */
  async function handleSubmitForm(values: Schema) {
    await createSetupUser.mutateAsync(values);
    await signIn.mutateAsync(values);
    await updateSetup.mutateAsync({ step: SetupStep.CAMPAIGN });
    onSubmit();
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ControlledTextField size="small" name="name" label="Name" sx={{ my: 1 }} autoFocus />
          <ControlledTextField size="small" name="email" label="Email" sx={{ my: 1 }} />
          <ControlledTextField size="small" name="password" label="Password" type="password" sx={{ my: 1 }} />
        </Box>

        <LoadingButton loading={isSubmitting} disabled={!isValid} variant="contained" type="submit" sx={{ mt: 2 }}>
          Continue
        </LoadingButton>
      </form>
    </FormProvider>
  );
};
