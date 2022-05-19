import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useCreateDatabase } from '../../hooks/data/setup/useCreateDatabase';

interface IProps {
  onSubmit: () => void;
}

export const CreateDatabase: React.FC<IProps> = ({ onSubmit }) => {
  const createDatabase = useCreateDatabase();

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
    await createDatabase.mutateAsync();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <Typography variant="h1" align="center" gutterBottom>
        Welcome to Tarrasque App
      </Typography>

      <Typography paragraph>
        Tarrasque is a free, mobile-friendly, and open-source virtual tabletop for playing Dungeons &amp; Dragons.
      </Typography>

      <Typography paragraph>Ready to get started? First, {`let's`} initialize the database.</Typography>

      <LoadingButton loading={isSubmitting} variant="contained" type="submit">
        Continue
      </LoadingButton>
      <Typography variant="caption" component="div">
        This might take a couple minutes
      </Typography>
    </form>
  );
};
