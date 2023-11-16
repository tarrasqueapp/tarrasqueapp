import { Box, CircularProgress, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useGetSetup } from '../../hooks/data/setup/useGetSetup';
import { AppNavigation } from '../../lib/navigation';
import { CreateDatabase } from './CreateDatabase';
import { CreateUser } from './CreateUser';

export function Setup() {
  const { data, error, isLoading } = useGetSetup();

  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!data) return;
    // Redirect to the sign in page if the setup is already completed
    if (data.completed) {
      router.push(AppNavigation.VerifyEmail);
    }
    // Set active step depending on setup progress
    setActiveStep(data.step - 1);
  }, [data]);

  // Show progress bar while loading
  if (isLoading || data?.completed) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <CircularProgress disableShrink />
      </Box>
    );
  }

  // Show error message if there is an error
  if (error instanceof Error) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography paragraph>An error occurred while loading the setup wizard</Typography>
        <Typography color="error">{error.message}</Typography>
      </Box>
    );
  }

  /**
   * Go to the next step
   */
  function handleNext() {
    setActiveStep(activeStep + 1);
  }

  // Setup wizard steps
  const steps = [
    {
      label: 'Create the database',
      content: <CreateDatabase onSubmit={handleNext} />,
    },
    {
      label: 'Create your account',
      content: <CreateUser onSubmit={handleNext} />,
    },
  ];

  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>{step.content}</StepContent>
          </Step>
        ))}
      </Stepper>
    </>
  );
}
