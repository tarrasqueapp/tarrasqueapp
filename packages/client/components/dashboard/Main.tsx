import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { store } from '../../store';
import { CampaignAccordions } from './CampaignAccordions';

export const Main: React.FC = observer(() => {
  return (
    <Box
      component="main"
      sx={{
        width: `calc(100% - ${store.dashboard.sidebar?.clientWidth || 0}px)`,
        display: 'flex',
        flexDirection: 'column',
        flex: '1 0 auto',
        transition: 'padding 0.3s ease',
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: '1 0 auto' }}>
        <CampaignAccordions />
      </Box>
    </Box>
  );
});
