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
  const campaignMemberships = await ssr.prefetchUserCampaignMemberships();

  await Promise.all(
    campaignMemberships.map(async (membership) => {
      return await Promise.all([
        ssr.prefetchCampaign(membership.campaign_id),
        ssr.prefetchCampaignMaps(membership.campaign_id),
        ssr.prefetchCampaignMemberships(membership.campaign_id),
        ssr.prefetchCampaignInvites(membership.campaign_id),
        ssr.prefetchCampaignPlugins(membership.campaign_id),
      ]);
    }),
  );

  return (
    <HydrationBoundary state={ssr.dehydrate()}>
      <Dashboard />
    </HydrationBoundary>
  );
}
