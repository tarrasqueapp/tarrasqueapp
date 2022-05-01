import { Box, CircularProgress } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const MapIndex: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, []);

  return (
    <Box sx={{ display: 'flex', flex: '1 0 auto', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress disableShrink />
    </Box>
  );
};

export default MapIndex;
