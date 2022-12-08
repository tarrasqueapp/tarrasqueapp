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

interface IMapProps {
  map?: MapInterface;
}

export const Map: React.FC<IMapProps> = ({ map }) => {
  const skeletonWidth = MathUtils.getRandomBetween(150, 300);
  const maxHeight = 150;

  // Get the width and height of the map
  const width = map?.media.width ?? skeletonWidth;
  const height = map?.media.height ?? maxHeight;
  const aspectRatio = width / height;

  // Calculate the new width based on the aspect ratio
  const newWidth = maxHeight * aspectRatio;

  return (
    <Card sx={{ position: 'relative', width: newWidth, height: maxHeight }}>
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
        <Skeleton width={skeletonWidth} height={150} />
      )}
    </Card>
  );
};
