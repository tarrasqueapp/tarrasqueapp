import { Box } from '@mui/material';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { HUD } from '../components/Overlay';

const Canvas = dynamic(() => import('../components/Canvas'), { ssr: false });

const Home: NextPage = () => {
  return (
    <Box>
      <Canvas />
      <HUD />
    </Box>
  );
};

export default Home;
