'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Code } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, AlertTitle, Box, Paper, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { signIn } from '@/actions/auth';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { NextLink } from '@/components/navigation/NextLink';
import { config } from '@/utils/config';
import { AppNavigation } from '@/utils/navigation';
import { validation } from '@/utils/validation';

export function SignIn() {
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const searchParams = useSearchParams();

  const confirmEmail = searchParams.get('confirm-email');

  // Setup form
  type Schema = z.infer<typeof validation.schemas.auth.signIn>;
  const methods = useForm<Schema>({ mode: 'onChange', resolver: zodResolver(validation.schemas.auth.signIn) });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * Handle the form submission
   * @param values - The user values
   */
  async function handleSubmitForm(values: Schema) {
    const response = await signIn(values);

    if (response?.error) {
      toast.error(response.error);
      return;
    }

    setMagicLinkSent(true);
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

          {config.NODE_ENV === 'development' && (
            <Alert icon={<Code />} severity="warning" sx={{ mt: 3, alignItems: 'flex-start' }}>
              <AlertTitle>Developer Mode</AlertTitle>
              Emails are not sent in development mode. Check the server-side console for an email preview URL to confirm
              your email address.
            </Alert>
          )}
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

          {config.NODE_ENV === 'development' && (
            <Alert icon={<Code />} severity="warning" sx={{ mt: 3, alignItems: 'flex-start' }}>
              <AlertTitle>Developer Mode</AlertTitle>
              Emails are not sent in development mode. Check the server-side console for an email preview URL to sign
              in.
            </Alert>
          )}
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
