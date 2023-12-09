'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

import { Overlay } from '@/components/overlay/Overlay';
import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { useIframeDataSync } from '@/hooks/data/useIframeDataSync';
import { useEffectAsync } from '@/hooks/useEffectAsync';
import { useChannelStore } from '@/store/channels';

const Canvas = dynamic(() => import('@/components/canvas/Canvas'), { ssr: false });

export function MapId() {
  const { data: map } = useGetCurrentMap();
  useIframeDataSync();

  const { joinChannel } = useChannelStore();

  useEffectAsync(async () => {
    if (!map) return;

    // Join the map channel
    const channel = await joinChannel(`map_${map.id}`);

    console.log(channel, channel.presence, channel.presenceState);

    // Unsubscribe from the channel when the component unmounts
    return () => {
      channel.unsubscribe();
    };
  }, [map]);

  return (
    <>
      <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
        <Canvas />
        <Overlay />
      </Box>
    </>
  );
}
