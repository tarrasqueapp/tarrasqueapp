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

import { CreateCampaign } from '../components/setup/CreateCampaign';
import { CreateDatabase } from '../components/setup/CreateDatabase';
import { CreateMap } from '../components/setup/CreateMap';
import { CreateUser } from '../components/setup/CreateUser';
import { useGetSetup } from '../hooks/data/setup/useGetSetup';
import { useResetSetup } from '../hooks/data/setup/useResetSetup';

const Setup: NextPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const { data, error, isLoading, refetch } = useGetSetup();
  const resetSetup = useResetSetup();
  const router = useRouter();

  const setupCompleted = Boolean(data?.database && data?.user && data?.campaign && data?.map);

  useEffect(() => {
    if (!data) return;
    // Set active step depending on setup progress
    if (data.map) {
      setActiveStep(4);
    } else if (data.campaign) {
      setActiveStep(3);
    } else if (data.user) {
      setActiveStep(2);
    } else if (data.database) {
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
    refetch();
  }

  async function handleReset() {
    setIsResetting(true);
    await resetSetup.mutateAsync();
    setActiveStep(1);
    setIsResetting(false);
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
      content: <CreateCampaign onSubmit={handleNext} onReset={handleReset} isResetting={isResetting} />,
    },
    {
      label: 'Create a map',
      content: (
        <CreateMap
          campaignId={data?.campaign?.id}
          onSubmit={handleNext}
          onReset={handleReset}
          isResetting={isResetting}
        />
      ),
    },
  ];

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
