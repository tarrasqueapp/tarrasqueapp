import { Box, Container, Paper, Typography } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';

import { Center } from '../components/common/Center';
import { Logo } from '../components/common/Logo';
import { NextButton } from '../components/common/NextButton';
import { AppNavigation } from '../lib/navigation';

const NotFound: NextPage = () => {
  return (
    <Center>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Logo size={150} />
          </Box>

          <Paper sx={{ p: 4, background: 'rgba(0, 0, 0, 0.4)' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" paragraph>
                Can&apos;t find what you&apos;re looking for!
              </Typography>

              <NextButton href={AppNavigation.SignIn} variant="outlined">
                Go Back
              </NextButton>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Center>
  );
};

export default NotFound;
