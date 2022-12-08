import { CircularProgress } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Center } from '../components/common/Center';

const IndexPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, []);

  return (
    <Center>
      <CircularProgress disableShrink color="secondary" />
    </Center>
  );
};

export default IndexPage;
