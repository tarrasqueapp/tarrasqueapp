import { Box, Container } from '@mui/material';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import { Gradient } from '@/lib/colors';

import { DashboardModals } from './DashboardModals';
import { CampaignAccordions } from './campaigns/CampaignAccordions';
import { CampaignModals } from './campaigns/CampaignModals';
import { MapModals } from './maps/MapModals';
import { TopBar } from './top-bar/TopBar';

export function Dashboard() {
  const collapsedCampaignsCookie = getCookie('campaigns/collapsed', { cookies }) || '';
  const collapsedCampaigns = collapsedCampaignsCookie ? collapsedCampaignsCookie.split(',') : [];

  return (
    <>
      <Box
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto', background: Gradient.LINEAR }}
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
          <CampaignAccordions collapsedCampaigns={collapsedCampaigns} />
        </Container>
      </Box>

      <DashboardModals />
      <CampaignModals />
      <MapModals />
    </>
  );
}
