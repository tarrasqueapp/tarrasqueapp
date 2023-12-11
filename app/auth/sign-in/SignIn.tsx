'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Alert, Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { signIn } from '@/actions/auth';
import { ControlledPasswordField } from '@/components/form/ControlledPasswordField';
import { ControlledTextField } from '@/components/form/ControlledTextField';

export function SignIn() {
  const searchParams = useSearchParams();

  const confirmEmail = searchParams.get('confirm-email');

  // Setup form validation schema
  const schema = z.object({
    email: z.string().email().min(1),
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
   * @param values - The user values
   */
  async function handleSubmitForm(values: Schema) {
    try {
      await signIn(values);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <>
      {confirmEmail && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Great! We&apos;ve just sent you an email with a link to confirm your email address. Please click the link in
          the email to continue.
        </Alert>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
            <ControlledTextField name="email" label="Email" autoFocus autoComplete="email" />

            <ControlledPasswordField name="password" label="Password" autoComplete="current-password" />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ mt: 2, mb: 1 }}>
              Submit
            </LoadingButton>
          </Box>
        </form>
      </FormProvider>
    </>
  );
}
