import { Box, CircularProgress, Paper, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useGetUserCampaigns } from '../../hooks/data/campaigns/useGetUserCampaigns';
import { useGetSetup } from '../../hooks/data/setup/useGetSetup';
import { useResetSetup } from '../../hooks/data/setup/useResetSetup';
import { useGetRefreshToken } from '../../hooks/data/users/useGetRefreshToken';
import { AppNavigation } from '../../lib/navigation';
import { SetupStep } from '../../lib/types';
import { CreateCampaign } from './CreateCampaign';
import { CreateDatabase } from './CreateDatabase';
import { CreateMap } from './CreateMap';
import { CreateUser } from './CreateUser';
import { SignIn } from './SignIn';

export const Setup: React.FC = () => {
  const { data, error, isLoading } = useGetSetup();
  const { data: campaigns } = useGetUserCampaigns();
  const { data: refreshTokenData, isLoading: isLoadingRefreshToken } = useGetRefreshToken();
  const resetSetup = useResetSetup();

  const [activeStep, setActiveStep] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!data) return;
    // Redirect to the home page if the setup is already completed
    if (data.completed) {
      router.push(AppNavigation.Home);
    }
    // Set active step depending on setup progress
    setActiveStep(data.step - 1);
  }, [data]);

  // Show progress bar while loading
  if (isLoading || data?.completed || isLoadingRefreshToken) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <CircularProgress disableShrink />
      </Box>
    );
  }

  if (data && data.step > SetupStep.USER && !refreshTokenData) {
    return <SignIn />;
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

  /**
   * Reset the setup and go to the first step
   */
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
          campaignId={campaigns?.[0]?.id}
          onSubmit={handleNext}
          onReset={handleReset}
          isResetting={isResetting}
        />
      ),
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

      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
        </Paper>
      )}
    </>
  );
};
