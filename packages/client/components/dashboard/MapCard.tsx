import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete, Edit, FileCopy, MoreHoriz } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
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
import { useState } from 'react';

import { useDuplicateMap } from '../../hooks/data/maps/useDuplicateMap';
import { AppNavigation } from '../../lib/navigation';
import { CampaignInterface, MapInterface } from '../../lib/types';
import { store } from '../../store';
import { MapModal } from '../../store/maps';

interface MapCardProps {
  map?: MapInterface;
  campaign?: CampaignInterface;
}

export const MapCard: React.FC<MapCardProps> = ({ map, campaign }) => {
  const duplicateMap = useDuplicateMap();

  const [duplicating, setDuplicating] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: map?.id || '' });

  const width = 250;
  const height = 200;

  const thumbnailUrl = map?.media.find((media) => media.id === map.selectedMediaId)?.thumbnailUrl;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging && { opacity: 0.5 }),
  };

  return (
    <Card sx={{ position: 'relative', width, height }} ref={setNodeRef} style={style} {...attributes} {...listeners}>
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
                  src={thumbnailUrl}
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
                          <Edit />
                        </ListItemIcon>
                        <ListItemText>Update</ListItemText>
                      </MenuItem>

                      <MenuItem
                        disabled={duplicating}
                        onClick={async () => {
                          if (!map) return;
                          setDuplicating(true);
                          await duplicateMap.mutateAsync(map);
                          setDuplicating(false);
                          popupState.close();
                        }}
                      >
                        <ListItemIcon>
                          {duplicating ? <CircularProgress size={25.71} disableShrink /> : <FileCopy />}
                        </ListItemIcon>
                        <ListItemText>Duplicate</ListItemText>
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
                          <Delete />
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
