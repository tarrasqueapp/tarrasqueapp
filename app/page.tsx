import { redirect } from 'next/navigation';

import { SSRUtils } from '@/utils/helpers/ssr';
import { AppNavigation } from '@/utils/navigation';

export default async function IndexPage() {
  const ssr = new SSRUtils();

  const setup = await ssr.prefetchSetup();

  if (setup?.step !== 'COMPLETED') {
    redirect(AppNavigation.Setup);
  }

  const user = await ssr.prefetchUser();

  if (user) {
    redirect(AppNavigation.Dashboard);
  }

  redirect(AppNavigation.SignIn);
}
