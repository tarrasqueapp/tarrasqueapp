import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete, Edit, FileCopy, MoreHoriz, ScreenShare, Share } from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
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

import { Map, duplicateMap } from '@/actions/maps';
import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { useGetMemberships } from '@/hooks/data/campaigns/memberships/useGetMemberships';
import { useCampaignStore } from '@/store/useCampaignStore';
import { MapModal, useMapStore } from '@/store/useMapStore';
import { AppNavigation } from '@/utils/navigation';
import { supabaseLoader } from '@/utils/supabase/loader';

interface MapCardProps {
  map?: Map;
  campaignId?: string;
}

export function MapCard({ map, campaignId }: MapCardProps) {
  const { data: user } = useGetUser();
  const { data: memberships } = useGetMemberships(campaignId);

  const setModal = useMapStore((state) => state.setModal);
  const setSelectedCampaignId = useCampaignStore((state) => state.setSelectedCampaignId);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);

  const [duplicating, setDuplicating] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: map?.id || '' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging && { opacity: 0.5 }),
  };

  const isGameMaster = memberships?.some(
    (membership) => membership.user_id === user?.id && membership.role === 'GAME_MASTER',
  );

  const width = 250;
  const height = 200;

  if (!isGameMaster) {
    if (!map) {
      return (
        <Card sx={{ position: 'relative', width, height }}>
          <Skeleton width={width} height={height} />
        </Card>
      );
    }

    if (!map.visible) {
      return null;
    }

    return (
      <Card sx={{ position: 'relative', width, height }}>
        <NextLink href={`${AppNavigation.Map}/[mapId]`} as={`${AppNavigation.Map}/${map.id}`} passHref legacyBehavior>
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
                  loader={supabaseLoader}
                  src={map.media!.url}
                  width={width}
                  height={height}
                  priority
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

          <Tooltip title={map.visible ? 'Visible to players' : 'Not visible to players'}>
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.65) !important',
                p: 1,
                borderRadius: '10px 0 0 0',
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!map || !campaignId) return;
                setSelectedCampaignId(campaignId);
                setSelectedMapId(map.id);
                setModal(MapModal.Share);
              }}
            >
              <Share sx={{ fontSize: '1rem' }} color={map.visible ? 'action' : 'disabled'} />
            </IconButton>
          </Tooltip>

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
                            if (!map || !campaignId) return;
                            setSelectedCampaignId(campaignId);
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
                            await duplicateMap({ id: map.id });
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
                            if (!map || !campaignId) return;
                            setSelectedCampaignId(campaignId);
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

                        <Divider />

                        <MenuItem
                          onClick={() => {
                            if (!map || !campaignId) return;
                            setSelectedCampaignId(campaignId);
                            setSelectedMapId(map.id);
                            setModal(MapModal.Share);
                            popupState.close();
                          }}
                        >
                          <ListItemIcon>
                            <Share />
                          </ListItemIcon>
                          <ListItemText>Share</ListItemText>
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            popupState.close();
                          }}
                          component="a"
                          href={`${AppNavigation.Map}/${map.id}?present`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ListItemIcon>
                            <ScreenShare />
                          </ListItemIcon>
                          <ListItemText>Present</ListItemText>
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
