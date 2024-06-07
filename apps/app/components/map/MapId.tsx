'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { useIframeDataSync } from '@/hooks/data/useIframeDataSync';
import { useJoinCampaignChannel } from '@/hooks/realtime/useJoinCampaignChannel';
import { useJoinMapChannel } from '@/hooks/realtime/useJoinMapChannel';
import { usePixiStore } from '@/store/usePixiStore';

import { Overlay } from './overlay/Overlay';

const Canvas = dynamic(() => import('./canvas/Canvas'), { ssr: false });

interface Props {
  mapId: string;
  campaignId: string;
}

export function MapId({ mapId, campaignId }: Props) {
  useJoinMapChannel(mapId);
  useJoinCampaignChannel(campaignId);
  useIframeDataSync();

  const setMapId = usePixiStore((state) => state.setMapId);
  const pixiMapId = usePixiStore((state) => state.mapId);

  useEffect(() => {
    if (!mapId) return;
    setMapId(mapId);
  }, [mapId]);

  if (!pixiMapId) return null;

  return (
    <>
      <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
        <Canvas />
        <Overlay />
      </Box>
    </>
  );
}
