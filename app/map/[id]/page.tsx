import { Box } from '@mui/material';
import { HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { AppNavigation } from '@/lib/navigation';
import { SSRUtils } from '@/utils/SSRUtils';

import { MapId } from './MapId';

export const metadata = {
  title: 'Tarrasque App',
};

export default async function MapPage({ params }: { params: { id: string } }) {
  const ssr = new SSRUtils();

  const setup = await ssr.prefetchSetup();

  if (setup?.step !== 'COMPLETED') {
    redirect(AppNavigation.Setup);
  }

  await ssr.prefetchUser();
  const map = await ssr.prefetchMap(params.id);
  await ssr.prefetchCampaign(map?.campaign_id || '');
  await ssr.prefetchCampaignMemberships(map?.campaign_id || '');

  if (!map) {
    redirect(AppNavigation.Dashboard);
  }

  return (
    <HydrationBoundary state={ssr.dehydrate()}>
      <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
        <MapId />
      </Box>
    </HydrationBoundary>
  );
}
