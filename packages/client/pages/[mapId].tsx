import { Box } from '@mui/material';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { HUD } from '../components/HUD';
import { useEffectAsync } from '../hooks/useEffectAsync';
import { store } from '../store';

const Canvas = dynamic(() => import('../components/Canvas'), { ssr: false });

const MapId: NextPage = () => {
  const router = useRouter();

  useEffectAsync(async () => {
    if (!router.query || !router.isReady) return;
    const map = await store.maps.getMap('1');
    store.maps.setCurrentMap(map);
  }, [router.query, router.isReady]);

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
      <Canvas />
      <HUD />
    </Box>
  );
};

export default MapId;
