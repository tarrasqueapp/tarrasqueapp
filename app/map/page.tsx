import { redirect } from 'next/navigation';

import { AppNavigation } from '@/lib/navigation';
import { SSRUtils } from '@/utils/SSRUtils';

export default async function IndexPage() {
  const ssr = new SSRUtils();

  const setup = await ssr.prefetchSetup();

  if (setup?.step !== 'COMPLETED') {
    redirect(AppNavigation.Setup);
  }

  redirect(AppNavigation.Dashboard);
}
