import { CircularProgress } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Center } from '../components/common/Center';
import { AppNavigation } from '../lib/navigation';
import { SSRUtils } from '../utils/SSRUtils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssr = new SSRUtils(context);

  const setup = await ssr.getSetup();

  // Redirect to the setup page if the setup is not completed
  if (!setup?.completed) {
    return { props: {}, redirect: { destination: AppNavigation.Setup } };
  }

  return { props: {} };
};

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
