'use client';

import { Box, Container } from '@mui/material';
import { useEffect } from 'react';

import { SocketEvent } from '@tarrasque/common';

import { CampaignAccordions } from '../../components/dashboard/CampaignAccordions';
import { DashboardModals } from '../../components/dashboard/DashboardModals';
import { TopBar } from '../../components/dashboard/TopBar/TopBar';
import { useGetUser } from '../../hooks/data/auth/useGetUser';
import { useGetUserCampaigns } from '../../hooks/data/campaigns/useGetUserCampaigns';
import { useWebSocketCacheSync } from '../../hooks/data/useWebSocketCacheSync';
import { Gradient } from '../../lib/colors';
import { socket } from '../../lib/socket';

export function Dashboard() {
  const { data: campaigns } = useGetUserCampaigns();
  const { data: user } = useGetUser();
  useWebSocketCacheSync();

  useEffect(() => {
    if (!user || !campaigns || !socket.connected) return;

    // Join the user room
    socket.emit(SocketEvent.JOIN_USER_ROOM);

    // Join the campaign rooms
    campaigns.forEach((campaign) => {
      socket.emit(SocketEvent.JOIN_CAMPAIGN_ROOM, campaign.id);
    });
  }, [socket]);

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
          <CampaignAccordions />
        </Container>
      </Box>

      <DashboardModals />
    </>
  );
}
