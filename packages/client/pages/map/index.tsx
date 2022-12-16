import { CircularProgress } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Center } from '../../components/common/Center';
import { AppNavigation } from '../../lib/navigation';

const MapIndexPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(AppNavigation.Dashboard);
  }, []);

  return (
    <Center>
      <CircularProgress disableShrink />
    </Center>
  );
};

export default MapIndexPage;
