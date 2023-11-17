import { Box, Container } from '@mui/material';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';

import { CampaignAccordions } from '../components/dashboard/CampaignAccordions';
import { DashboardModals } from '../components/dashboard/DashboardModals';
import { TopBar } from '../components/dashboard/TopBar/TopBar';
import { Gradient } from '../lib/colors';
import { AppNavigation } from '../lib/navigation';
import { SSRUtils } from '../utils/SSRUtils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssr = new SSRUtils(context);

  const setup = await ssr.getSetup();

  // Redirect to the setup page if the setup is not completed
  if (!setup?.completed) {
    return { props: {}, redirect: { destination: AppNavigation.Setup } };
  }

  // Prefetch the user
  const user = await ssr.getUser();

  // Redirect to the sign-in page if the user is not signed in
  if (!user) {
    return { props: {}, redirect: { destination: AppNavigation.SignIn } };
  }

  // Prefetch campaigns and maps
  const campaigns = await ssr.getUserCampaigns();
  await Promise.all(campaigns.map((campaign) => ssr.getCampaignMaps(campaign.id)));

  return { props: { dehydratedState: ssr.dehydrate() } };
};

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard · Tarrasque App</title>
      </Head>

      <Box
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto', background: Gradient.Linear }}
      >
        <TopBar />

        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            flex: '1 0 auto',
            transition: 'padding 0.3s ease',
            p: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <CampaignAccordions />
        </Container>
      </Box>

      <DashboardModals />
    </>
  );
}
