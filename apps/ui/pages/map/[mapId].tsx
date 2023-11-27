import { Box } from '@mui/material';
import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { SocketEvent } from '@tarrasque/common';

import { Overlay } from '../../components/overlay/Overlay';
import { useGetUser } from '../../hooks/data/auth/useGetUser';
import { useGetCampaign } from '../../hooks/data/campaigns/useGetCampaign';
import { useGetCurrentMap } from '../../hooks/data/maps/useGetCurrentMap';
import { useIframeDataSync } from '../../hooks/data/useIframeDataSync';
import { useWebSocketCacheSync } from '../../hooks/data/useWebSocketCacheSync';
import { AppNavigation } from '../../lib/navigation';
import { SSRUtils } from '../../utils/SSRUtils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssr = new SSRUtils(context);

  const setup = await ssr.getSetup();

  // Redirect to the setup page if the setup is not completed
  if (!setup?.completed) {
    return { props: {}, redirect: { destination: AppNavigation.Setup } };
  }

  // Get the map ID from the URL
  const mapId = context.query.mapId as string;

  // Prefetch the user and map
  await Promise.all([ssr.getUser(), ssr.getMap(mapId)]);

  return { props: { dehydratedState: ssr.dehydrate() } };
};

const Canvas = dynamic(() => import('../../components/canvas/Canvas'), { ssr: false });

export default function MapPage() {
  const { data: map } = useGetCurrentMap();
  const { data: campaign } = useGetCampaign(map?.campaignId || '');
  const { data: user } = useGetUser();
  useIframeDataSync();
  useWebSocketCacheSync({
    onConnect(socket) {
      if (!user || !map) return;

      // Join the user room
      socket.emit(SocketEvent.JOIN_USER_ROOM);

      // Join the campaign room
      socket.emit(SocketEvent.JOIN_CAMPAIGN_ROOM, map.campaignId);

      // Join the map room
      socket.emit(SocketEvent.JOIN_MAP_ROOM, map.id);
    },
  });

  return (
    <>
      <Head>
        <title>{map ? `${map.name} · Tarrasque App` : 'Tarrasque App'}</title>
      </Head>

      <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
        <Canvas />
        <Overlay />
      </Box>
    </>
  );
}
