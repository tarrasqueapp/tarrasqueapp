'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

import { Overlay } from '../../../components/overlay/Overlay';
import { useGetUser } from '../../../hooks/data/auth/useGetUser';
import { useGetCampaign } from '../../../hooks/data/campaigns/useGetCampaign';
import { useGetCurrentMap } from '../../../hooks/data/maps/useGetCurrentMap';
import { useIframeDataSync } from '../../../hooks/data/useIframeDataSync';
import { useWebSocketCacheSync } from '../../../hooks/data/useWebSocketCacheSync';

const Canvas = dynamic(() => import('../../../components/canvas/Canvas'), { ssr: false });

export function MapId() {
  const { data: map } = useGetCurrentMap();
  const { data: campaign } = useGetCampaign(map?.campaignId || '');
  const { data: user } = useGetUser();
  useIframeDataSync();
  useWebSocketCacheSync();

  return (
    <>
      <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
        <Canvas />
        <Overlay />
      </Box>
    </>
  );
}
