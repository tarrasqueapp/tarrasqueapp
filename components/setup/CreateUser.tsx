import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { signUp } from '@/actions/auth';
import { updateSetup } from '@/actions/setup';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { config } from '@/utils/config';
import { validation } from '@/utils/validation';

interface CreateUserProps {
  onSubmit: () => void;
}

export function CreateUser({ onSubmit }: CreateUserProps) {
  // Setup form
  type Schema = z.infer<typeof validation.schemas.auth.signUp>;
  const methods = useForm<Schema>({ mode: 'onChange', resolver: zodResolver(validation.schemas.auth.signUp) });
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    setValue,
  } = methods;

  /**
   * Handle the form submission
   * @param values - The user values
   */
  async function handleSubmitForm(values: Schema) {
    if (config.TURNSTILE_ENABLED && !values.turnstileToken) {
      toast.error('Please verify you are human.');
      return;
    }

    const signUpResponse = await signUp(values);

    if (signUpResponse?.error) {
      toast.error(signUpResponse.error);
      return;
    }

    const updateSetupResponse = await updateSetup({ step: 'COMPLETED' });

    if (updateSetupResponse?.error) {
      toast.error(updateSetupResponse.error);
      return;
    }

    onSubmit();
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ControlledTextField name="name" label="Name" sx={{ my: 1 }} autoFocus autoComplete="name" />

          <ControlledTextField name="email" label="Email" sx={{ my: 1 }} autoComplete="email" />

          {config.TURNSTILE_ENABLED && (
            <Turnstile
              siteKey={config.TURNSTILE_SITE_KEY}
              style={{ margin: 'auto' }}
              onSuccess={(token) => {
                setValue('turnstileToken', token);
              }}
              onError={() => {
                toast.error('Failed to verify you are human. Please try again.');
                setValue('turnstileToken', null);
              }}
              onExpire={() => {
                setValue('turnstileToken', null);
              }}
            />
          )}
        </Box>

        <LoadingButton
          loading={isSubmitting}
          disabled={!isValid}
          variant="contained"
          type="submit"
          sx={{ mt: 2, mb: 1 }}
        >
          Continue
        </LoadingButton>
      </form>
    </FormProvider>
  );
}
