import { Box, Container, Paper } from '@mui/material';
import { GetServerSideProps } from 'next';
import React from 'react';

import { Center } from '../components/common/Center';
import { Logo } from '../components/common/Logo';
import { Setup } from '../components/setup/Setup';
import { AppNavigation } from '../lib/navigation';
import { SSRUtils } from '../utils/SSRUtils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssr = new SSRUtils(context);

  const setup = await ssr.getSetup();

  // Redirect to the sign in page if the setup has been completed
  if (setup?.completed) return { props: {}, redirect: { destination: AppNavigation.SignIn } };

  return { props: { dehydratedState: ssr.dehydrate() } };
};

export default function SetupPage() {
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
}
