import { Box } from '@mui/material';
import type { NextPage } from 'next';

import { getSetup } from '../hooks/data/setup/useGetSetup';

export async function getServerSideProps() {
  // Get the setup data from the database
  const setup = await getSetup();

  // Redirect to the setup page if the setup is not completed
  const setupCompleted = Boolean(setup?.database && setup?.user && setup?.campaign && setup?.map);
  if (!setupCompleted) return { redirect: { destination: '/setup' } };

  return { props: {} };
}

const Dashboard: NextPage = () => {
  return <Box>Dashboard</Box>;
};

export default Dashboard;
