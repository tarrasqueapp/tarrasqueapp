'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { useIframeDataSync } from '@/hooks/data/useIframeDataSync';
import { useJoinCampaignChannel } from '@/hooks/realtime/useJoinCampaignChannel';
import { useJoinMapChannel } from '@/hooks/realtime/useJoinMapChannel';

import { Overlay } from '../_components/overlay/Overlay';

const Canvas = dynamic(() => import('../_components/canvas/Canvas'), { ssr: false });

export function MapId() {
  const { data: map } = useGetCurrentMap();
  useJoinMapChannel(map?.id);
  useJoinCampaignChannel(map?.campaign_id);
  useIframeDataSync();

  return (
    <>
      <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
        <Canvas />
        <Overlay />
      </Box>
    </>
  );
}
