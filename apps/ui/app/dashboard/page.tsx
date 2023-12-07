import { HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { AppNavigation } from '../../lib/navigation';
import { SSRUtils } from '../../utils/SSRUtils';
import { Dashboard } from './Dashboard';

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
  await ssr.prefetchUserCampaigns();

  return (
    <HydrationBoundary state={ssr.dehydrate()}>
      <Dashboard />
    </HydrationBoundary>
  );
}
