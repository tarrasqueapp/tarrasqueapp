import { Box, CircularProgress } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';

import { NextLink } from '../components/NextLink';
import { Campaigns } from '../components/dashboard/Campaigns';
import { getSetup } from '../hooks/data/setup/useGetSetup';
import { getUser, useGetUser } from '../hooks/data/users/useGetUser';

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

  if (!user) return <CircularProgress disableShrink />;

  return (
    <Box>
      <Campaigns />

      <NextLink href="/sign-out">Sign out</NextLink>
    </Box>
  );
};

export default DashboardPage;
