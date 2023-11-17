import { Box } from '@mui/material';
import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { Overlay } from '../../components/overlay/Overlay';
import { useGetCurrentMap } from '../../hooks/data/maps/useGetCurrentMap';
import { AppNavigation } from '../../lib/navigation';
import { SSRUtils } from '../../utils/SSRUtils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssr = new SSRUtils(context);

  const setup = await ssr.getSetup();

  // Redirect to the setup page if the setup is not completed
  if (!setup?.completed) {
    return { props: {}, redirect: { destination: AppNavigation.Setup } };
  }

  // Prefetch the user
  await ssr.getUser();

  return { props: { dehydratedState: ssr.dehydrate() } };
};

const Canvas = dynamic(() => import('../../components/canvas/Canvas'), { ssr: false });

export default function MapPage() {
  const { data: map } = useGetCurrentMap();

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
