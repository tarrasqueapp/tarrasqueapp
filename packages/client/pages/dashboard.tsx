import { Box, CircularProgress } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';

import { Center } from '../components/common/Center';
import { Campaigns } from '../components/dashboard/Campaigns';
import { Footer } from '../components/dashboard/Footer';
import { Sidebar } from '../components/dashboard/Sidebar';
import { getSetup } from '../hooks/data/setup/useGetSetup';
import { getUser, useGetUser } from '../hooks/data/users/useGetUser';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Gradient } from '../lib/colors';
import { Role } from '../lib/types';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the setup data from the database
  const setup = await getSetup();

  // Render normally if the server can't be reached
  if (!setup) return { props: {} };

  // Redirect to the setup page if the setup is not completed
  if (!setup.completed) return { props: {}, redirect: { destination: '/setup' } };

  // Redirect to the sign-in page if the user is not signed in
  try {
    await getUser({ withCredentials: true, headers: { Cookie: context.req.headers.cookie || '' } });
  } catch (err) {
    return { props: {}, redirect: { destination: '/sign-in' } };
  }

  return { props: {} };
};

const DashboardPage: NextPage = () => {
  const { data: user } = useGetUser();

  useProtectedRoute(Role.USER);

  if (!user) {
    return (
      <Center>
        <CircularProgress disableShrink color="secondary" />
      </Center>
    );
  }

  return (
    <Box sx={{ display: 'flex', flex: '1 0 auto', background: Gradient.Linear }}>
      <Sidebar />

      <Box
        component="main"
        sx={{ width: 'calc(100% - 240px)', display: 'flex', flexDirection: 'column', flex: '1 0 auto', p: 3 }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: '1 0 auto' }}>
          <Campaigns />
        </Box>

        <Footer />
      </Box>
    </Box>
  );
};

export default DashboardPage;
