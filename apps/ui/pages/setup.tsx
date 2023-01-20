import { Box, Container, Paper } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';

import { Center } from '../components/common/Center';
import { Logo } from '../components/common/Logo';
import { Setup } from '../components/setup/Setup';

const SetupPage: NextPage = () => {
  return (
    <Center>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Logo size={150} />
          </Box>

          <Paper sx={{ p: 1, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
            <Setup />
          </Paper>
        </Box>
      </Container>
    </Center>
  );
};

export default SetupPage;
