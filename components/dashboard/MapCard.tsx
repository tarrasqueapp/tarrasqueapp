import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete, Edit, FileCopy, MoreHoriz } from '@mui/icons-material';
import {
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
import Image from 'next/image';
import NextLink from 'next/link';
import { useState } from 'react';

import { Map } from '@/actions/maps';
import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { useGetMemberships } from '@/hooks/data/campaigns/memberships/useGetMemberships';
import { useDuplicateMap } from '@/hooks/data/maps/useDuplicateMap';
import { AppNavigation } from '@/lib/navigation';
import { storageImageLoader } from '@/lib/storageImageLoader';
import { CampaignEntity, Role } from '@/lib/types';
import { useCampaignStore } from '@/store/campaign';
import { MapModal, useMapStore } from '@/store/map';

interface MapCardProps {
  map?: Map;
  campaign?: CampaignEntity;
}

export function MapCard({ map, campaign }: MapCardProps) {
  const { data: user } = useGetUser();
  const { data: memberships } = useGetMemberships(campaign?.id || '');
  const duplicateMap = useDuplicateMap();

  const { setSelectedMapId, setModal } = useMapStore();
  const { setSelectedCampaignId } = useCampaignStore();

  const [duplicating, setDuplicating] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: map?.id || '' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging && { opacity: 0.5 }),
  };

  const isGameMaster = memberships?.some(
    (membership) => membership.user_id === user?.id && membership.role === Role.GAME_MASTER,
  );

  const width = 250;
  const height = 200;

  if (!isGameMaster) {
    return (
      <Card sx={{ position: 'relative', width, height }}>
        {map ? (
          <>
            <NextLink
              href={`${AppNavigation.Map}/[mapId]`}
              as={`${AppNavigation.Map}/${map.id}`}
              passHref
              legacyBehavior
            >
              <CardActionArea>
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width,
                    height,
                    background: 'rgba(255, 255, 255, 0.03)',
                  }}
                >
                  <Typography variant="body2" sx={{ wordBreak: 'break-word', m: 1.5 }}>
                    {map.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </NextLink>
          </>
        ) : (
          <Skeleton width={width} height={height} />
        )}
      </Card>
    );
  }

  return (
    <Card
      sx={{ position: 'relative', width, height }}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isGameMaster && listeners)}
    >
      {map ? (
        <>
          <NextLink href={`${AppNavigation.Map}/[mapId]`} as={`${AppNavigation.Map}/${map.id}`} passHref legacyBehavior>
            <CardActionArea sx={{ position: 'static' }}>
              <CardMedia>
                <Image
                  loader={storageImageLoader}
                  src={map.media!.url}
                  width={width}
                  height={height}
                  layout="responsive"
                  alt=""
                  style={{
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
            <Typography variant="body2" sx={{ wordBreak: 'break-word', mr: 0.5, my: 1.5 }}>
              {map.name}
            </Typography>

            {isGameMaster && (
              <PopupState variant="popover" popupId={`map-card-${map.id}`}>
                {(popupState) => (
                  <>
                    <Tooltip title="More">
                      <span>
                        <IconButton {...bindTrigger(popupState)}>
                          <MoreHoriz />
                        </IconButton>
                      </span>
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
                            setSelectedCampaignId(campaign.id);
                            setSelectedMapId(map.id);
                            setModal(MapModal.CreateUpdate);
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
                            // await duplicateMap.mutateAsync(map);
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
                            setSelectedCampaignId(campaign.id);
                            setSelectedMapId(map.id);
                            setModal(MapModal.Delete);
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
            )}
          </CardContent>
        </>
      ) : (
        <Skeleton width={width} height={height} />
      )}
    </Card>
  );
}
