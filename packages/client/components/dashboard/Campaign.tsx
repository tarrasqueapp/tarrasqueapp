import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import NextLink from 'next/link';

import { useGetCampaignMaps } from '../../hooks/data/maps/useGetCampaignMaps';
import { CampaignInterface } from '../../lib/types';

interface ICampaignProps {
  campaign: CampaignInterface;
}

export const Campaign: React.FC<ICampaignProps> = ({ campaign }) => {
  const { data: maps } = useGetCampaignMaps(campaign.id);

  return (
    <Box>
      <Typography variant="h3">{campaign.name}</Typography>
      <Box sx={{ display: 'flex' }}>
        {maps?.map((map) => (
          <Card key={map.id} sx={{ m: 1.5 }}>
            <NextLink href="/map/[mapId]" as={`/map/${map.id}`} passHref legacyBehavior>
              <CardActionArea>
                <CardMedia sx={{ height: 150 }}>
                  <Box
                    component="img"
                    src={map.media.thumbnailUrl}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </CardMedia>
                <CardContent>
                  <Typography align="center">{map.name}</Typography>
                </CardContent>
              </CardActionArea>
            </NextLink>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
