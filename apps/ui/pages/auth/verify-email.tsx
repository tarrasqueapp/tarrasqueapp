import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Center } from '../../components/common/Center';
import { Logo } from '../../components/common/Logo';
import { NextButton } from '../../components/common/NextButton';
import { useVerifyEmail } from '../../hooks/data/auth/useVerifyEmail';
import { useEffectAsync } from '../../hooks/useEffectAsync';
import { AppNavigation } from '../../lib/navigation';
import { SSRUtils } from '../../utils/SSRUtils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssr = new SSRUtils(context);

  // Get the user
  const user = await ssr.getUser();

  // Redirect to the dashboard page if the user is signed in
  if (user) {
    return { props: {}, redirect: { destination: AppNavigation.Dashboard } };
  }

  // Get the token from the query string
  const token = (context.query.token as string) || '';

  return { props: { token, dehydratedState: ssr.dehydrate() } };
};

interface VerifyEmailPageProps {
  token: string;
}

export default function VerifyEmailPage({ token }: VerifyEmailPageProps) {
  const verifyEmail = useVerifyEmail();

  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token || !valid) return;
    setTimeout(() => {
      router.push(AppNavigation.Dashboard);
    });
  }, [token, valid]);

  useEffectAsync(async () => {
    if (!token) return;
    try {
      setLoading(true);
      await verifyEmail.mutateAsync(token);
      setValid(true);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [token]);

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
            {loading ? (
              <CircularProgress disableShrink />
            ) : (
              <>
                {!token && (
                  <>
                    <Typography>Please check your inbox to verify your email</Typography>
                    <Button component="a" href={AppNavigation.SignIn} variant="outlined" sx={{ mt: 2 }}>
                      Go Back
                    </Button>
                  </>
                )}

                {token && !valid && (
                  <>
                    <Typography>Invalid token</Typography>
                    <Button component="a" href={AppNavigation.SignIn} variant="outlined" sx={{ mt: 2 }}>
                      Go Back
                    </Button>
                  </>
                )}

                {token && valid && (
                  <>
                    <Typography>All done! Redirecting...</Typography>
                    <NextButton href={AppNavigation.SignIn} variant="contained" sx={{ mt: 2 }}>
                      Continue
                    </NextButton>
                  </>
                )}
              </>
            )}
          </Paper>
        </Box>
      </Container>
    </Center>
  );
}
