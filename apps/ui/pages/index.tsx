import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Center } from '../components/common/Center';
import { AppNavigation } from '../lib/navigation';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.push(AppNavigation.Dashboard);
  }, []);

  return (
    <Center>
      <CircularProgress disableShrink />
    </Center>
  );
}
