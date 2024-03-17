import { Box, Container, Typography } from '@mui/material';
import React from 'react';

import { Center } from '@/components/Center';
import { Logo } from '@/components/Logo';
import { NextButton } from '@/components/navigation/NextButton';
import { AppNavigation } from '@/utils/navigation';

export default function NotFound() {
  return (
    <Center>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Logo size={150} />
          </Box>

          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h3" paragraph>
              Can&apos;t find what you&apos;re looking for!
            </Typography>

            <NextButton href={AppNavigation.Dashboard} variant="outlined">
              Go Back
            </NextButton>
          </Box>
        </Box>
      </Container>
    </Center>
  );
}
