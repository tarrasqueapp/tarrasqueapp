import { Box, Container, Typography } from '@mui/material';
import React from 'react';

import { Center } from '@/components/common/Center';
import { Logo } from '@/components/common/Logo';
import { NextButton } from '@/components/common/NextButton';
import { AppNavigation } from '@/lib/navigation';

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
