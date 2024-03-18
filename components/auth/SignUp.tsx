'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { LoadingButton } from '@mui/lab';
import { Alert, Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { signUp } from '@/actions/auth';
import { Invite } from '@/actions/invites';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { config } from '@/utils/config';
import { AppNavigation } from '@/utils/navigation';
import { validation } from '@/utils/validation';

export function SignUp({ invite }: { invite?: Invite | null }) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || invite?.email || '';
  const inviteId = searchParams.get('invite');

  // Setup form
  type Schema = z.infer<typeof validation.schemas.auth.signUp>;
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: zodResolver(validation.schemas.auth.signUp),
    defaultValues: { name: '', email, inviteId, turnstileToken },
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
    if (config.TURNSTILE_ENABLED && !turnstileToken) {
      toast.error('Please verify you are human.');
      return;
    }

    const response = await signUp({ ...values, inviteId, turnstileToken });

    if (response?.error) {
      toast.error(response.error);
      return;
    }

    router.push(`${AppNavigation.SignIn}/?confirm-email=true`);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
          {invite && (
            <Alert severity="info" variant="outlined">
              You have been invited to join <strong>{invite.campaign!.name}</strong>. Please fill out the form below to
              create your account.
            </Alert>
          )}
          <ControlledTextField name="name" label="Name" autoFocus autoComplete="fname" />

          <ControlledTextField name="email" label="Email" disabled={Boolean(invite)} autoComplete="email" />

          {config.TURNSTILE_ENABLED && (
            <Turnstile
              siteKey={config.TURNSTILE_SITE_KEY}
              style={{ margin: 'auto' }}
              onSuccess={(token) => {
                setTurnstileToken(token);
              }}
              onError={() => {
                toast.error('Failed to verify you are human. Please try again.');
                setTurnstileToken(null);
              }}
              onExpire={() => {
                setTurnstileToken(null);
              }}
            />
          )}
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
