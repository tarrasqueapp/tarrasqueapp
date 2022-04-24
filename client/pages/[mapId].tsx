import { Box } from '@mui/material';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { HUD } from '../components/HUD';
import { store } from '../store';

const Canvas = dynamic(() => import('../components/Canvas'), { ssr: false });

const MapId: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.query) return;
    store.map.setId(router.query.mapId as string);
  }, [router.query]);

  return (
    <Box>
      <Canvas />
      <HUD />
    </Box>
  );
};

export default MapId;
