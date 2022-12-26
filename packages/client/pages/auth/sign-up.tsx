import { Box, Container, Paper, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { SignUp } from '../../components/auth/SignUp';
import { Center } from '../../components/common/Center';
import { Logo } from '../../components/common/Logo';
import { NextLink } from '../../components/common/NextLink';
import { getSetup } from '../../hooks/data/setup/useGetSetup';
import { checkRefreshToken } from '../../hooks/data/users/useGetRefreshToken';
import { AppNavigation } from '../../lib/navigation';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the setup data from the database
  const setup = await getSetup();

  // Render normally if the server can't be reached
  if (!setup) return { props: {} };

  // Redirect to the setup page if the setup is not completed
  if (!setup.completed) return { props: {}, redirect: { destination: AppNavigation.Setup } };

  // Redirect to the dashboard page if the user is logged in
  try {
    const user = await checkRefreshToken({
      withCredentials: true,
      headers: { Cookie: context.req.headers.cookie || '' },
    });
    if (user) return { props: {}, redirect: { destination: AppNavigation.Dashboard } };
  } catch (err) {}

  return { props: {} };
};

const SignUpPage: NextPage = () => {
  return (
    <Center>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Logo size={150} />
          </Box>

          <Typography variant="h3" align="center" sx={{ mt: 1, mb: 3 }}>
            Sign up
          </Typography>

          <Paper sx={{ p: 2, width: '100%' }}>
            <SignUp />
          </Paper>

          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            Already have an account? <NextLink href={AppNavigation.SignIn}>Sign in</NextLink>
          </Typography>
        </Box>
      </Container>
    </Center>
  );
};

export default SignUpPage;
