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

import { AppNavigation } from '../../lib/navigation';
import { CampaignInterface, MapInterface } from '../../lib/types';
import { store } from '../../store';
import { MapModal } from '../../store/maps';

interface IMapCardProps {
  map?: MapInterface;
  campaign?: CampaignInterface;
}

export const MapCard: React.FC<IMapCardProps> = ({ map, campaign }) => {
  const width = 250;
  const height = 200;

  return (
    <Card sx={{ position: 'relative', width, height }}>
      {map ? (
        <>
          <NextLink
            href={`${AppNavigation.Map}/[mapId]`}
            as={`${AppNavigation.Map}/${map?.id}`}
            passHref
            legacyBehavior
          >
            <CardActionArea sx={{ position: 'static' }}>
              <CardMedia>
                <Box
                  component="img"
                  src={map.media.thumbnailUrl}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
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
            <Typography variant="body2" sx={{ wordBreak: 'break-word', mr: 0.5 }}>
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
                          store.maps.setModal(MapModal.CreateUpdate);
                          popupState.close();
                        }}
                      >
                        <ListItemIcon>
                          <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Update</ListItemText>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          if (!map || !campaign) return;
                          store.campaigns.setSelectedCampaign(campaign);
                          store.maps.setSelectedMap(map);
                          store.maps.setModal(MapModal.Delete);
                          popupState.close();
                        }}
                      >
                        <ListItemIcon>
                          <Delete fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
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
