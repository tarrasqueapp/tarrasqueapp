import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateSetupUser } from '../../hooks/data/setup/useCreateSetupUser';
import { useLogin } from '../../hooks/data/users/useLogin';
import { ControlledTextField } from '../form/ControlledTextField';

interface IProps {
  onSubmit: () => void;
}

export const CreateUser: React.FC<IProps> = ({ onSubmit }) => {
  const createSetupUser = useCreateSetupUser();
  const login = useLogin();

  // Setup form validation schema
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().min(1).email(),
    password: z.string().min(8),
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
    await createSetupUser.mutateAsync(values);
    await login.mutateAsync(values);
    onSubmit();
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ControlledTextField size="small" name="name" label="Name" sx={{ my: 1 }} />
          <ControlledTextField size="small" name="email" label="Email" sx={{ my: 1 }} />
          <ControlledTextField size="small" name="password" label="Password" type="password" sx={{ my: 1 }} />
        </Box>

        <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ mt: 2 }}>
          Continue
        </LoadingButton>
      </form>
    </FormProvider>
  );
};
