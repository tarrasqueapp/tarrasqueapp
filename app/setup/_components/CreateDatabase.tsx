import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { createDatabase } from '@/actions/setup';

interface CreateDatabaseProps {
  onSubmit: () => void;
}

export function CreateDatabase({ onSubmit }: CreateDatabaseProps) {
  // Setup form
  const methods = useForm({ mode: 'onChange' });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * Handle the form submission
   */
  async function handleSubmitForm() {
    const response = await createDatabase();

    if (response?.error) {
      toast.error(response.error);
      return;
    }

    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <Typography variant="h3" gutterBottom sx={{ py: 2 }}>
        Welcome to Tarrasque App
      </Typography>

      <Typography paragraph>
        Tarrasque is a free, open-source, and mobile-friendly virtual tabletop for playing Dungeons &amp; Dragons.
      </Typography>

      <Typography paragraph>Ready to get started? First, let&apos;s initialize the database.</Typography>

      <LoadingButton loading={isSubmitting} variant="contained" type="submit">
        Continue
      </LoadingButton>
    </form>
  );
}
