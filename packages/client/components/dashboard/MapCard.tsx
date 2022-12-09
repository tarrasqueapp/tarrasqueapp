import { MoreHoriz } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';

import { Color } from '../../lib/colors';
import { MapInterface } from '../../lib/types';
import { MathUtils } from '../../utils/MathUtils';

const MIN_WIDTH = 200;
const MAX_HEIGHT = 200;

interface IMapCardProps {
  map?: MapInterface;
}

export const MapCard: React.FC<IMapCardProps> = ({ map }) => {
  const skeletonWidth = MathUtils.getRandomBetween(150, 300);

  // Get the width and height of the map and calculate the aspect ratio
  const mapWidth = map?.media.width ?? skeletonWidth;
  const mapHeight = map?.media.height ?? MAX_HEIGHT;
  const aspectRatio = mapWidth / mapHeight;

  // Calculate the new dimensions based on the aspect ratio, minimum width, and max height
  const width = Math.min(Math.max(mapWidth, MIN_WIDTH), MAX_HEIGHT * aspectRatio);
  const height = width / aspectRatio;

  return (
    <Card sx={{ position: 'relative', width, height: height }}>
      {map ? (
        <>
          <NextLink href="/map/[mapId]" as={`/map/${map?.id}`} passHref legacyBehavior>
            <CardActionArea sx={{ position: 'static' }}>
              <CardMedia>
                <Box
                  component="img"
                  src={map.media.thumbnailUrl}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    inset: 0,
                  }}
                />
              </CardMedia>
            </CardActionArea>
          </NextLink>

          <CardContent
            sx={{
              position: 'inherit',
              p: '4px 14px !important',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.65)',
            }}
          >
            <Typography variant="body2" sx={{ wordBreak: 'break-all', mr: 1, maxWidth: 300 }}>
              {map.name}
            </Typography>

            <Tooltip title="More" placement="bottom">
              <IconButton edge="end">
                <MoreHoriz htmlColor={Color.White} />
              </IconButton>
            </Tooltip>
          </CardContent>
        </>
      ) : (
        <Skeleton width={width} height={height} />
      )}
    </Card>
  );
};
