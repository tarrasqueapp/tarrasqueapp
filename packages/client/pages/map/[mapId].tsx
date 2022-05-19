import { Box } from '@mui/material';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { HUD } from '../../components/HUD';

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
