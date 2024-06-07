import { Box, Container } from '@mui/material';
import { HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { Center } from '@/components/Center';
import { Logo } from '@/components/Logo';
import { Setup } from '@/components/setup/Setup';
import { SSRUtils } from '@/utils/helpers/ssr';
import { AppNavigation } from '@/utils/navigation';

export default async function SetupPage() {
  const ssr = new SSRUtils();

  const setup = await ssr.prefetchSetup();

  if (setup?.step === 'COMPLETED') {
    redirect(AppNavigation.SignIn);
  }

  return (
    <HydrationBoundary state={ssr.dehydrate()}>
      <Center>
        <Container maxWidth="xs">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Logo size={150} />
            </Box>

            <Setup />
          </Box>
        </Container>
      </Center>
    </HydrationBoundary>
  );
}
