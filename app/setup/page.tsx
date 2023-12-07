import { Box, Container } from '@mui/material';
import { HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import React from 'react';

import { Center } from '../../components/common/Center';
import { Logo } from '../../components/common/Logo';
import { AppNavigation } from '../../lib/navigation';
import { SSRUtils } from '../../utils/SSRUtils';
import { Setup } from './Setup';

export default async function SetupPage() {
  const ssr = new SSRUtils();

  const setup = await ssr.prefetchSetup();

  if (setup?.step === 'COMPLETED') {
    redirect(AppNavigation.Home);
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
