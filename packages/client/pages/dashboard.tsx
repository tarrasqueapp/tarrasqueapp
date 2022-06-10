import { Box } from '@mui/material';
import type { NextPage } from 'next';

import { Uploader } from '../components/form/Uploader';
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
  return (
    <Box>
      Dashboard
      <Box sx={{ width: 200 }}>
        <Uploader value="http://localhost:10000/uploads/cl47ge85400161wpcs3eve2wd/f17d715133c812dd2207ef47507cb12e.thumbnail.webp" />
      </Box>
    </Box>
  );
};

export default Dashboard;
