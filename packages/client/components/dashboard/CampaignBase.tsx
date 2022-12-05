import { Box, Typography } from '@mui/material';

import { CampaignInterface, MapInterface } from '../../lib/types';
import { Map } from './Map';

interface ICampaignBaseProps {
  campaign: CampaignInterface;
  maps?: MapInterface[];
}

export const CampaignBase: React.FC<ICampaignBaseProps> = ({ campaign, maps }) => {
  return (
    <Box>
      <Typography variant="h3">{campaign.name}</Typography>

      <Box sx={{ display: 'flex' }}>
        {maps?.map((map) => (
          <Map key={map.id} map={map} />
        ))}
      </Box>
    </Box>
  );
};
