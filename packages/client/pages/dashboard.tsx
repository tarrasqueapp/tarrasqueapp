import { Box } from '@mui/material';
import type { NextPage } from 'next';

import { getSetup } from '../hooks/data/setup/useGetSetup';

export async function getServerSideProps() {
  // Get the setup data from the database
  const setup = await getSetup();

  // Render normally if the server can't be reached
  if (!setup) return { props: {} };

  // Redirect to the setup page if the setup is not completed
  if (!setup.completed) return { redirect: { destination: '/setup' } };

  return { props: {} };
}

const Dashboard: NextPage = () => {
  return <Box>Dashboard</Box>;
};

export default Dashboard;
