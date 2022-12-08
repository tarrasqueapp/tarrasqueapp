import { Box, Container, Paper } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { Center } from '../components/common/Center';
import { SignIn } from '../components/setup/SignIn';
import { getSetup } from '../hooks/data/setup/useGetSetup';
import { getUser } from '../hooks/data/users/useGetUser';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the setup data from the database
  const setup = await getSetup();

  // Render normally if the server can't be reached
  if (!setup) return { props: {} };

  // Redirect to the setup page if the setup is not completed
  if (!setup.completed) return { props: {}, redirect: { destination: '/setup' } };

  // Redirect to the dashboard page if the user is logged in
  try {
    const user = await getUser({ withCredentials: true, headers: { Cookie: context.req.headers.cookie || '' } });
    if (user) return { props: {}, redirect: { destination: '/dashboard' } };
  } catch (err) {}

  return { props: {} };
};

const SignInPage: NextPage = () => {
  const router = useRouter();

  return (
    <Center>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src="/images/logo.svg" alt="Logo" width="150" />
          </Box>

          <Paper sx={{ p: 2, width: '100%' }}>
            <SignIn onSuccess={() => router.push('/dashboard')} />
          </Paper>
        </Box>
      </Container>
    </Center>
  );
};

export default SignInPage;