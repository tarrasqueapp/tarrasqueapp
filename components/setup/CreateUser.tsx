import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { signUp } from '@/actions/auth';
import { updateSetup } from '@/actions/setup';
import { ControlledTextField } from '@/components/form/ControlledTextField';

interface CreateUserProps {
  onSubmit: () => void;
}

export function CreateUser({ onSubmit }: CreateUserProps) {
  // Setup form validation schema
  const schema = z.object({ name: z.string().min(1), email: z.string().email().min(1) });
  type Schema = z.infer<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({ mode: 'onChange', resolver: zodResolver(schema) });
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  /**
   * Handle the form submission
   * @param values - The user values
   */
  async function handleSubmitForm(values: Schema) {
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
