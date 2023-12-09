'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { updateUser } from '@/actions/auth';
import { ControlledPasswordField } from '@/components/form/ControlledPasswordField';
import { AppNavigation } from '@/lib/navigation';
import { ValidateUtils } from '@/utils/ValidateUtils';

export function ResetPassword() {
  const router = useRouter();

  // Setup form validation schema
  const schema = yup
    .object()
    .shape(
      {
        password: ValidateUtils.Password,
        confirmPassword: ValidateUtils.Password.oneOf([yup.ref('password')], 'Passwords must match'),
      },
      [['password', 'password']],
    )
    .required();
  type Schema = yup.InferType<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
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
      await updateUser({ password: values.password });
      router.push(AppNavigation.Dashboard);
      toast.success('Password updated');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
          <ControlledPasswordField name="password" label="Password" autoComplete="new-password" />

          <ControlledPasswordField name="confirmPassword" label="Confirm Password" autoComplete="new-password" />
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
