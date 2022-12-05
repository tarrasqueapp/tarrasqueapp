import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import NextLink from 'next/link';

import { MapInterface } from '../../lib/types';

interface IMapProps {
  map: MapInterface;
}

export const Map: React.FC<IMapProps> = ({ map }) => {
  return (
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
  );
};
