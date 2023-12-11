import { Box, Container } from '@mui/material';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import { CampaignAccordions } from '@/components/dashboard/CampaignAccordions';
import { DashboardModals } from '@/components/dashboard/DashboardModals';
import { TopBar } from '@/components/dashboard/TopBar/TopBar';
import { Gradient } from '@/lib/colors';

export function Dashboard() {
  const collapsedCampaignsCookie = getCookie('campaigns/collapsed', { cookies }) || '';
  const collapsedCampaigns = collapsedCampaignsCookie ? collapsedCampaignsCookie.split(',') : [];

  return (
    <>
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
          <CampaignAccordions collapsedCampaigns={collapsedCampaigns} />
        </Container>
      </Box>

      <DashboardModals />
    </>
  );
}
