import { Box, Container, Paper, Typography } from '@mui/material';
import { redirect } from 'next/navigation';

import { Center } from '../../../components/common/Center';
import { Logo } from '../../../components/common/Logo';
import { NextLink } from '../../../components/common/NextLink';
import { AppNavigation } from '../../../lib/navigation';
import { SSRUtils } from '../../../utils/SSRUtils';
import { SignIn } from './SignIn';

export default async function SignInPage() {
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
            Sign in
          </Typography>

          <Paper sx={{ p: 2, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
            <SignIn />
          </Paper>

          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            <NextLink href={AppNavigation.ForgotPassword}>Forgot your password?</NextLink>
          </Typography>

          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Don&apos;t have an account? <NextLink href={AppNavigation.SignUp}>Sign up</NextLink>
          </Typography>
        </Box>
      </Container>
    </Center>
  );
}
