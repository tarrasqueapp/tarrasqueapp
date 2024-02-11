'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box, Paper, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { signIn } from '@/actions/auth';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { NextLink } from '@/components/navigation/NextLink';
import { AppNavigation } from '@/lib/navigation';

export function SignIn() {
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const searchParams = useSearchParams();

  const confirmEmail = searchParams.get('confirm-email');

  // Setup form validation schema
  const schema = z.object({
    email: z.string().email().min(1),
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
      setMagicLinkSent(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <>
      {confirmEmail && (
        <Paper sx={{ p: 4, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
            Check your email
          </Typography>

          <Typography>
            Great! We&apos;ve just sent you an email with a link to confirm your email address. Please click the link in
            the email to continue.
          </Typography>
        </Paper>
      )}

      {magicLinkSent && (
        <Paper sx={{ p: 4, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
            Check your email
          </Typography>

          <Typography>
            We&apos;ve just sent you an email with a magic link to sign in. Please click the link in the email to
            continue.
          </Typography>
        </Paper>
      )}

      {!magicLinkSent && !confirmEmail && (
        <Paper sx={{ p: 2, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
                <ControlledTextField name="email" label="Email" autoFocus autoComplete="email" />
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <LoadingButton
                  loading={isSubmitting}
                  variant="contained"
                  type="submit"
                  sx={{ mt: 2, mb: 1 }}
                  disabled={magicLinkSent}
                >
                  Submit
                </LoadingButton>
              </Box>
            </form>
          </FormProvider>
        </Paper>
      )}

      {!magicLinkSent && !confirmEmail && (
        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          Don&apos;t have an account? <NextLink href={AppNavigation.SignUp}>Sign up</NextLink>
        </Typography>
      )}
    </>
  );
}