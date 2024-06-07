'use client';

import { CircularProgress, Paper, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useGetSetup } from '@/hooks/data/setup/useGetSetup';
import { AppNavigation } from '@/utils/navigation';

import { CreateDatabase } from './CreateDatabase';
import { CreateUser } from './CreateUser';

export function Setup() {
  const { data } = useGetSetup();

  const stepMap = {
    INITIAL: 0,
    CREATED_DATABASE: 1,
    CREATED_USER: 2,
    COMPLETED: 3,
  };

  const [activeStep, setActiveStep] = useState(data ? stepMap[data.step] : stepMap.INITIAL);

  useEffect(() => {
    if (!data) return;
    // Redirect to sign in page when setup is completed
    if (data.step === 'COMPLETED') {
      redirect(`${AppNavigation.SignIn}/?confirm-email=true`);
    }

    // Set active step depending on setup progress
    if (!data.step) {
      setActiveStep(stepMap.INITIAL);
    } else if (data.step === 'CREATED_DATABASE') {
      setActiveStep(stepMap.CREATED_DATABASE);
    } else if (data.step === 'CREATED_USER') {
      setActiveStep(stepMap.CREATED_USER);
    }
  }, [data]);

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

  if (data?.step === 'COMPLETED') {
    return <CircularProgress disableShrink />;
  }

  return (
    <Paper sx={{ p: 1, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>{step.content}</StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}
