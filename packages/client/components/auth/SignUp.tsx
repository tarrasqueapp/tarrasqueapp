import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { useSignUp } from '../../hooks/data/users/useSignUp';
import { AppNavigation } from '../../lib/navigation';
import { ValidateUtils } from '../../utils/ValidateUtils';
import { ControlledPasswordField } from '../form/ControlledPasswordField';
import { ControlledTextField } from '../form/ControlledTextField';

export const SignUp: React.FC = () => {
  const signUp = useSignUp();

  const router = useRouter();

  // Setup form validation schema
  const schema = yup
    .object()
    .shape(
      {
        name: ValidateUtils.Name,
        email: ValidateUtils.Email,
        password: ValidateUtils.Password,
        confirmPassword: ValidateUtils.Password.oneOf([yup.ref('password')], 'Passwords must match'),
      },
      [['password', 'password']],
    )
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
      await signUp.mutateAsync(values);
      router.push(AppNavigation.Dashboard);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
          <ControlledTextField name="name" label="Name" autoFocus />

          <ControlledTextField name="email" label="Email" autoFocus />

          <ControlledPasswordField name="password" label="Password" fullWidth />

          <ControlledPasswordField name="confirmPassword" label="Confirm Password" fullWidth />
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
