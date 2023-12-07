'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { ControlledTextField } from '../../../components/form/ControlledTextField';
import { ValidateUtils } from '../../../utils/ValidateUtils';
import { forgotPassword } from './actions';

export function ForgotPassword() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';

  // Setup form validation schema
  const schema = yup.object({ email: ValidateUtils.Email }).required();
  type Schema = yup.InferType<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { email },
  });
  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
  } = methods;

  /**
   * Handle the form submission
   * @param values - The user values
   */
  async function handleSubmitForm(values: Schema) {
    try {
      await forgotPassword(values.email);
      reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
          {isSubmitSuccessful && (
            <Alert severity="info" variant="outlined" sx={{ mb: 1 }}>
              If an account with that email exists, we&apos;ve sent you an email with a link to reset your password.
            </Alert>
          )}

          <ControlledTextField name="email" label="Email" autoFocus autoComplete="email" />
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ mt: 2, mb: 1 }}>
            Submit
          </LoadingButton>
        </Box>
      </form>
    </FormProvider>
  );
}
