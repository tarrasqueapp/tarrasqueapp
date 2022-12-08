import { Box, Container, Paper } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';

import { Center } from '../components/common/Center';
import { Setup } from '../components/setup/Setup';

const SetupPage: NextPage = () => {
  return (
    <Center>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src="/images/logo.svg" alt="Logo" width="150" />
          </Box>

          <Paper sx={{ p: 1, width: '100%' }}>
            <Setup />
          </Paper>
        </Box>
      </Container>
    </Center>
  );
};

export default SetupPage;
