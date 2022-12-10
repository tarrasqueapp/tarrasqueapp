import { Delete, Edit, MoreHoriz } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import NextLink from 'next/link';

import { CampaignInterface, MapInterface } from '../../lib/types';
import { store } from '../../store';
import { MapModal } from '../../store/maps';
import { MathUtils } from '../../utils/MathUtils';

const MIN_WIDTH = 200;
const MAX_HEIGHT = 200;

interface IMapCardProps {
  map?: MapInterface;
  campaign?: CampaignInterface;
}

export const MapCard: React.FC<IMapCardProps> = ({ map, campaign }) => {
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

            <PopupState variant="popover" popupId={`map-card-${map.id}`}>
              {(popupState) => (
                <>
                  <Tooltip title="More">
                    <IconButton {...bindTrigger(popupState)}>
                      <MoreHoriz />
                    </IconButton>
                  </Tooltip>
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          if (!map || !campaign) return;
                          store.campaigns.setSelectedCampaign(campaign);
                          store.maps.setSelectedMap(map);
                          store.maps.setModal(MapModal.AddEdit);
                          popupState.close();
                        }}
                      >
                        <ListItemIcon>
                          <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          if (!map || !campaign) return;
                          store.campaigns.setSelectedCampaign(campaign);
                          store.maps.setSelectedMap(map);
                          store.maps.setModal(MapModal.Remove);
                          popupState.close();
                        }}
                      >
                        <ListItemIcon>
                          <Delete fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Remove</ListItemText>
                      </MenuItem>
                    </MenuList>
                  </Popover>
                </>
              )}
            </PopupState>
          </CardContent>
        </>
      ) : (
        <Skeleton width={width} height={height} />
      )}
    </Card>
  );
};
