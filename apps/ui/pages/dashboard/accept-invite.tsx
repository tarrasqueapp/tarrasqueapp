import { Box, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { ActionTokenEntity, ActionTokenType } from '@tarrasque/common';

import { Center } from '../../components/common/Center';
import { Logo } from '../../components/common/Logo';
import { NextButton } from '../../components/common/NextButton';
import { useAcceptInvite } from '../../hooks/data/notifications/useAcceptInvite';
import { useEffectAsync } from '../../hooks/useEffectAsync';
import { AppNavigation } from '../../lib/navigation';
import { SSRUtils } from '../../utils/SSRUtils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssr = new SSRUtils(context);

  const setup = await ssr.getSetup();

  // Redirect to the setup page if the setup is not completed
  if (!setup?.completed) {
    return { props: {}, redirect: { destination: AppNavigation.Setup } };
  }

  // Prefetch the user
  const user = await ssr.getUser();

  // Redirect to the sign-in page if the user is not signed in
  if (!user) {
    return { props: {}, redirect: { destination: AppNavigation.SignIn } };
  }

  // Get the token from the query string
  const tokenId = context.query.token as string;
  let token = await ssr.getActionToken(tokenId, ActionTokenType.INVITE);
  // Ensure the token belongs to the user
  token = token?.email === user.email ? token : null;

  // Dehydrate the state
  return { props: { token, dehydratedState: ssr.dehydrate() } };
};

interface Props {
  token?: ActionTokenEntity;
}

export default function AcceptInvitePage({ token }: Props) {
  const acceptInvite = useAcceptInvite();

  const router = useRouter();

  useEffectAsync(async () => {
    if (!token) return;
    await acceptInvite.mutateAsync(token);
    router.push(AppNavigation.Dashboard);
  }, []);

  return (
    <Center>
      <Container maxWidth="xs" disableGutters>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Logo size={150} />
          </Box>

          <Typography variant="h3" align="center" sx={{ mt: 1, mb: 3 }}>
            Accept invite
          </Typography>

          <Paper sx={{ p: 2, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {!router.query.token && (
                <>
                  <Typography paragraph>No token was provided</Typography>

                  <NextButton href={AppNavigation.SignIn} variant="contained" sx={{ mt: 2 }}>
                    Go Back
                  </NextButton>
                </>
              )}

              {Boolean(router.query.token && !token) && (
                <>
                  <Typography>
                    It appears the invitation link you&apos;ve tried to use is either{' '}
                    <strong>expired or invalid</strong>. If the link has expired, you may need to request a new one from
                    the sender.
                  </Typography>

                  <NextButton href={AppNavigation.SignIn} variant="contained" sx={{ mt: 2 }}>
                    Go Back
                  </NextButton>
                </>
              )}

              {Boolean(router.query.token && token && acceptInvite.isPending) && (
                <>
                  <CircularProgress disableShrink />
                </>
              )}

              {Boolean(router.query.token && token && acceptInvite.isSuccess) && (
                <>
                  <Typography paragraph>All done! Redirecting...</Typography>

                  <NextButton href={AppNavigation.Dashboard} variant="contained" sx={{ mt: 2 }}>
                    Continue
                  </NextButton>
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
    </Center>
  );
}
