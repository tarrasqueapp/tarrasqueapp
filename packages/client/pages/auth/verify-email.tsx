import { Box, Container, Paper, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { Center } from '../../components/common/Center';
import { Logo } from '../../components/common/Logo';
import { NextButton } from '../../components/common/NextButton';
import { checkRefreshToken } from '../../hooks/data/users/useGetRefreshToken';
import { verifyEmail } from '../../hooks/data/users/useVerifyEmail';
import { AppNavigation } from '../../lib/navigation';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Redirect to the dashboard page if the user is logged in
  try {
    const user = await checkRefreshToken({
      withCredentials: true,
      headers: { Cookie: context.req.headers.cookie || '' },
    });
    if (user) return { props: {}, redirect: { destination: AppNavigation.Dashboard } };
  } catch (err) {}

  // Get the token from the query string
  const token = (context.query.token as string) || '';

  // Verify the user's email address
  let valid = false;
  try {
    await verifyEmail(token);
    valid = true;
  } catch (err) {}

  return { props: { token, valid } };
};

const VerifyEmailPage: NextPage<{ token: string; valid: boolean }> = ({ token, valid }) => {
  return (
    <Center>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Logo size={150} />
          </Box>

          <Typography variant="h3" align="center" sx={{ mt: 1, mb: 3 }}>
            Verify email
          </Typography>

          <Paper sx={{ p: 2, width: '100%', textAlign: 'center', background: 'rgba(0, 0, 0, 0.4)' }}>
            {!token && (
              <>
                <Typography>No token was provided</Typography>
                <NextButton href={AppNavigation.SignIn} variant="outlined" sx={{ mt: 2 }}>
                  Go Back
                </NextButton>
              </>
            )}
            {token && !valid && (
              <>
                <Typography>Invalid token</Typography>
                <NextButton href={AppNavigation.SignIn} variant="outlined" sx={{ mt: 2 }}>
                  Go Back
                </NextButton>
              </>
            )}
            {token && valid && (
              <>
                <Typography>Your email has been verified!</Typography>
                <NextButton href={AppNavigation.SignIn} variant="contained" sx={{ mt: 2 }}>
                  Continue
                </NextButton>
              </>
            )}
          </Paper>
        </Box>
      </Container>
    </Center>
  );
};

export default VerifyEmailPage;
