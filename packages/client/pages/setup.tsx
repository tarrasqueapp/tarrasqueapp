import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { CreateDatabase } from '../components/setup/CreateDatabase';
import { CreateUser } from '../components/setup/CreateUser';
import { useSetup } from '../hooks/useSetup';

const Setup: NextPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { data, error, mutate, isLoading } = useSetup();
  const router = useRouter();

  const setupCompleted = data?.databaseCreated && data?.userCreated && data?.campaignCreated && data?.mapCreated;

  useEffect(() => {
    if (!data) return;
    // Set active step depending on setup progress
    if (data.mapCreated) {
      setActiveStep(4);
    } else if (data.campaignCreated) {
      setActiveStep(3);
    } else if (data.userCreated) {
      setActiveStep(2);
    } else if (data.databaseCreated) {
      setActiveStep(1);
    }
    // Redirect to the home page if the setup is already completed
    if (setupCompleted) {
      router.push('/');
    }
  }, [data]);

  // Show progress bar while loading
  if (isLoading || setupCompleted) {
    return <CircularProgress disableShrink />;
  }

  // Show error message if there is an error
  if (error) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography paragraph>An error occurred while loading the setup wizard</Typography>
        <Typography color="error">{error.message}</Typography>
      </Box>
    );
  }

  // Setup wizard steps
  const steps = [
    {
      label: 'Create the database',
      content: <CreateDatabase onSubmit={handleNext} />,
    },
    {
      label: 'Create a user',
      content: <CreateUser onSubmit={handleNext} />,
    },
    {
      label: 'Create a campaign',
      content: <></>,
    },
    {
      label: 'Create a map',
      content: <></>,
    },
  ];

  /**
   * Go to the next step
   */
  async function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    mutate();
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img src="/images/logo.svg" alt="Logo" width="150" />
        </Box>

        <Paper sx={{ p: 1, width: '100%' }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>{step.content}</StepContent>
              </Step>
            ))}
          </Stepper>

          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>All steps completed - you&apos;re finished</Typography>
            </Paper>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Setup;
