'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { signUp } from '@/actions/auth';
import { ControlledPasswordField } from '@/components/form/ControlledPasswordField';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { AppNavigation } from '@/lib/navigation';

export function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams?.get('email') || '';

  // Setup form validation schema
  const schema = z
    .object({
      name: z.string().min(1),
      email: z.string().email().min(1),
      password: z.string().min(8),
      confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
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
      await signUp(values);
      router.push(`${AppNavigation.SignIn}/?confirm-email=true`);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
          <ControlledTextField name="name" label="Name" autoFocus autoComplete="name" />

          <ControlledTextField name="email" label="Email" disabled autoComplete="email" />

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
