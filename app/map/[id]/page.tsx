import { Box } from '@mui/material';
import { HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { MapId } from '@/components/map/MapId';
import { SSRUtils } from '@/utils/helpers/ssr';
import { AppNavigation } from '@/utils/navigation';

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

  if (!map) {
    redirect(AppNavigation.Dashboard);
  }

  await Promise.all([
    ssr.prefetchMapGrid(map.id),
    ssr.prefetchCampaign(map.campaign_id),
    ssr.prefetchCampaignMemberships(map.campaign_id),
    ssr.prefetchCampaignPlugins(map.campaign_id),
  ]);

  return (
    <HydrationBoundary state={ssr.dehydrate()}>
      <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
        <MapId mapId={map.id} campaignId={map.campaign_id} />
      </Box>
    </HydrationBoundary>
  );
}
