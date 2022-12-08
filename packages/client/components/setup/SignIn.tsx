import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { useSignIn } from '../../hooks/data/users/useSignIn';
import { ControlledTextField } from '../form/ControlledTextField';

interface ISignInProps {
  onSuccess?: () => void;
}

export const SignIn: React.FC<ISignInProps> = ({ onSuccess }) => {
  const signIn = useSignIn();

  // Setup form validation schema
  const schema = z.object({
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
    try {
      await signIn.mutateAsync(values);
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ControlledTextField size="small" name="email" label="Email" sx={{ m: 1 }} autoFocus />
          <ControlledTextField size="small" name="password" label="Password" type="password" sx={{ m: 1 }} />
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ mt: 2, mb: 1 }}>
            Sign in
          </LoadingButton>
        </Box>
      </form>
    </FormProvider>
  );
};
