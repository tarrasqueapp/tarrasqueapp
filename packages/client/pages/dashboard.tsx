import { Box, CircularProgress } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import { Center } from '../components/common/Center';
import { DashboardModals } from '../components/dashboard/DashboardModals';
import { Main } from '../components/dashboard/Main';
import { Sidebar } from '../components/dashboard/Sidebar';
import { TopBar } from '../components/dashboard/TopBar';
import { getSetup } from '../hooks/data/setup/useGetSetup';
import { getUser, useGetUser } from '../hooks/data/users/useGetUser';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Gradient } from '../lib/colors';
import { AppNavigation } from '../lib/navigation';
import { Role } from '../lib/types';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the setup data from the database
  const setup = await getSetup();

  // Render normally if the server can't be reached
  if (!setup) return { props: {} };

  // Redirect to the setup page if the setup is not completed
  if (!setup.completed) return { props: {}, redirect: { destination: AppNavigation.Setup } };

  // Redirect to the sign-in page if the user is not signed in
  try {
    await getUser({ withCredentials: true, headers: { Cookie: context.req.headers.cookie || '' } });
  } catch (err) {
    return { props: {}, redirect: { destination: AppNavigation.SignIn } };
  }

  return { props: {} };
};

const DashboardPage: NextPage = () => {
  const { isLoading } = useGetUser();

  useProtectedRoute(Role.USER);

  if (isLoading) {
    return (
      <Center>
        <CircularProgress disableShrink />
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard · Tarrasque App</title>
      </Head>

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto', background: Gradient.Linear }}>
        <TopBar />

        <Box sx={{ display: 'flex', flex: '1 0 auto' }}>
          <Sidebar />

          <Main />
        </Box>
      </Box>

      <DashboardModals />
    </>
  );
};

export default DashboardPage;
