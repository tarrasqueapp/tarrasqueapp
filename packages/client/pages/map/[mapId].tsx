import { Box } from '@mui/material';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { HUD } from '../../components/HUD';
import { getSetup } from '../../hooks/data/setup/useGetSetup';

export async function getServerSideProps() {
  // Get the setup data from the database
  const setup = await getSetup();

  // Render normally if the server can't be reached
  if (!setup) return { props: {} };

  // Redirect to the setup page if the setup is not completed
  if (!setup.completed) return { redirect: { destination: '/setup' } };

  return { props: {} };
}

const Canvas = dynamic(() => import('../../components/Canvas'), { ssr: false });

const MapId: NextPage = () => {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
      <Canvas />
      <HUD />
    </Box>
  );
};

export default MapId;
