import { HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { AppNavigation } from '@/lib/navigation';
import { SSRUtils } from '@/utils/SSRUtils';

import { Dashboard } from './_components/Dashboard';

export const metadata = {
  title: 'Dashboard · Tarrasque App',
};

export default async function DashboardPage() {
  const ssr = new SSRUtils();

  const setup = await ssr.prefetchSetup();

  if (setup?.step !== 'COMPLETED') {
    redirect(AppNavigation.Setup);
  }

  const user = await ssr.prefetchUser();

  if (!user) {
    redirect(AppNavigation.SignIn);
  }

  await ssr.prefetchProfile();
  const campaigns = await ssr.prefetchUserCampaigns();

  await Promise.all(
    campaigns.map(async (campaign) => {
      return await Promise.all([
        ssr.prefetchCampaignMaps(campaign.id),
        ssr.prefetchCampaignMemberships(campaign.id),
        ssr.prefetchCampaignInvites(campaign.id),
      ]);
    }),
  );

  return (
    <HydrationBoundary state={ssr.dehydrate()}>
      <Dashboard />
    </HydrationBoundary>
  );
}
