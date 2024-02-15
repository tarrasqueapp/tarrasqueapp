'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Alert, Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { signUp } from '@/actions/auth';
import { Invite } from '@/actions/invites';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { AppNavigation } from '@/lib/navigation';

export function SignUp({ invite }: { invite?: Invite | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || invite?.email || '';
  const token = searchParams.get('token') || '';

  // Setup form validation schema
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email().min(1),
  });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: { email },
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
      await signUp({ ...values, token: token || undefined });
      router.push(`${AppNavigation.SignIn}/?confirm-email=true`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
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
