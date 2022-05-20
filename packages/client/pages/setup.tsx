import { Box, Container, Paper } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';

import { SetupPage } from '../components/setup/SetupPage';

const Setup: NextPage = () => {
  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img src="/images/logo.svg" alt="Logo" width="150" />
        </Box>

        <Paper sx={{ p: 1, width: '100%' }}>
          <SetupPage />
        </Paper>
      </Box>
    </Container>
  );
};

export default Setup;
