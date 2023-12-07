import { Box, Container, Paper, Typography } from '@mui/material';
import { redirect } from 'next/navigation';
import React from 'react';

import { Center } from '../../../components/common/Center';
import { Logo } from '../../../components/common/Logo';
import { NextLink } from '../../../components/common/NextLink';
import { AppNavigation } from '../../../lib/navigation';
import { SSRUtils } from '../../../utils/SSRUtils';
import { ForgotPassword } from './ForgotPassword';

export default async function ForgotPasswordPage() {
  const ssr = new SSRUtils();

  const setup = await ssr.prefetchSetup();

  if (setup?.step !== 'COMPLETED') {
    redirect(AppNavigation.Setup);
  }

  const user = await ssr.prefetchUser();

  if (user) {
    redirect(AppNavigation.Dashboard);
  }

  return (
    <Center>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Logo size={150} />
          </Box>

          <Typography variant="h3" align="center" sx={{ mt: 1, mb: 3 }}>
            Forgot password
          </Typography>

          <Paper sx={{ p: 2, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
            <ForgotPassword />
          </Paper>

          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            Back to <NextLink href={AppNavigation.SignIn}>sign in</NextLink>
          </Typography>
        </Box>
      </Container>
    </Center>
  );
}
