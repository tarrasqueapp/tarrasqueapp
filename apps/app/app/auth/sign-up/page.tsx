import { Box, Container, Paper, Typography } from '@mui/material';
import { redirect } from 'next/navigation';

import { getInvite } from '@/actions/invites';
import { Center } from '@/components/Center';
import { Logo } from '@/components/Logo';
import { SignUp } from '@/components/auth/SignUp';
import { NextLink } from '@/components/navigation/NextLink';
import { SSRUtils } from '@/utils/helpers/ssr';
import { AppNavigation } from '@/utils/navigation';

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const ssr = new SSRUtils();

  const setup = await ssr.prefetchSetup();

  if (setup?.step !== 'COMPLETED') {
    redirect(AppNavigation.Setup);
  }

  const user = await ssr.prefetchUser();

  if (user) {
    redirect(AppNavigation.Dashboard);
  }

  // Get the invite ID if it exists
  const inviteId = typeof searchParams.invite === 'string' ? searchParams.invite : undefined;
  const { data: invite } = inviteId ? await getInvite(inviteId) : { data: undefined };

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

          <Paper sx={{ p: 2, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
            <SignUp invite={invite} />
          </Paper>

          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            Already have an account? <NextLink href={AppNavigation.SignIn}>Sign in</NextLink>
          </Typography>
        </Box>
      </Container>
    </Center>
  );
}
