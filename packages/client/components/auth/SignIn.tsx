import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { useSignIn } from '../../hooks/data/users/useSignIn';
import { AppNavigation } from '../../lib/navigation';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledPasswordField } from '../form/ControlledPasswordField';
import { ControlledTextField } from '../form/ControlledTextField';

export const SignIn: React.FC = () => {
  const signIn = useSignIn();

  const router = useRouter();

  // Setup form validation schema
  const schema = yup
    .object({
      email: ValidateUtils.Email,
      password: ValidateUtils.Password,
    })
    .required();
  type Schema = yup.InferType<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({ mode: 'onChange', resolver: yupResolver(schema) });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * Handle the form submission
   * @param values - The user values
   */
  async function handleSubmitForm(values: Schema) {
    try {
      await signIn.mutateAsync(values);
      router.push(AppNavigation.Dashboard);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
          <ControlledTextField name="email" label="Email" autoFocus />

          <ControlledPasswordField name="password" label="Password" />
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ mt: 2, mb: 1 }}>
            Submit
          </LoadingButton>
        </Box>
      </form>
    </FormProvider>
  );
};
