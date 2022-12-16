import { Box, Container, Paper } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { Center } from '../../components/common/Center';
import { SignIn } from '../../components/setup/SignIn';
import { getSetup } from '../../hooks/data/setup/useGetSetup';
import { getUser } from '../../hooks/data/users/useGetUser';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { AppNavigation } from '../../lib/navigation';
import { Role } from '../../lib/types';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the setup data from the database
  const setup = await getSetup();

  // Render normally if the server can't be reached
  if (!setup) return { props: {} };

  // Redirect to the setup page if the setup is not completed
  if (!setup.completed) return { props: {}, redirect: { destination: AppNavigation.Setup } };

  // Redirect to the dashboard page if the user is logged in
  try {
    const user = await getUser({ withCredentials: true, headers: { Cookie: context.req.headers.cookie || '' } });
    if (user) return { props: {}, redirect: { destination: AppNavigation.Dashboard } };
  } catch (err) {}

  return { props: {} };
};

const SignInPage: NextPage = () => {
  useProtectedRoute(Role.GUEST);

  return (
    <Center>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src="/images/logo.svg" alt="Logo" width="150" />
          </Box>

          <Paper sx={{ p: 2, width: '100%' }}>
            <SignIn />
          </Paper>
        </Box>
      </Container>
    </Center>
  );
};

export default SignInPage;
