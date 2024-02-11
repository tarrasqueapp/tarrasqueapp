import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete, Edit, ExpandLess, ExpandMore, Extension, MoreHoriz, People } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Collapse,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Portal,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { useEffect, useState } from 'react';

import { Campaign } from '@/actions/campaigns';
import { reorderMaps } from '@/actions/maps';
import { Membership } from '@/actions/memberships';
import { UserAvatar } from '@/components/UserAvatar';
import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { useGetInvites } from '@/hooks/data/campaigns/invites/useGetInvites';
import { useGetMemberships } from '@/hooks/data/campaigns/memberships/useGetMemberships';
import { useGetCampaignMaps } from '@/hooks/data/maps/useGetCampaignMaps';
import { CampaignModal, useCampaignStore } from '@/store/campaign';
import { MathUtils } from '@/utils/MathUtils';

import { MapCard } from '../maps/MapCard';
import { NewMap } from '../maps/NewMap';

export interface CampaignAccordionProps {
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  campaign?: Campaign;
}

export function CampaignAccordion({ expanded, onToggle, campaign }: CampaignAccordionProps) {
  const { data: invites } = useGetInvites(campaign?.id || '');
  const { data: maps } = useGetCampaignMaps(campaign?.id || '');
  const { data: memberships } = useGetMemberships(campaign?.id || '');
  const { data: user } = useGetUser();

  const { setSelectedCampaignId, setModal } = useCampaignStore();

  // Drag and drop
  const [activeId, setActiveId] = useState<string | null>(null);
  const [orderedMaps, setOrderedMaps] = useState<typeof maps>(maps || []);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: campaign?.id || '',
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 500, tolerance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Set initial order of map ids and update when maps change
  useEffect(() => {
    setOrderedMaps(maps || []);
  }, [maps]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging && { opacity: 0.5 }),
  };

  const isGameMaster = memberships?.some(
    (membership) => membership.user_id === user?.id && membership.role === 'GAME_MASTER',
  );

  /**
   * Check if user is game master of campaign
   * @param membership - Membership to check
   * @returns True if user is game master of campaign
   */
  function isCampaignGameMaster(membership: Membership) {
    return memberships?.some(
      (campaignMembership) =>
        campaignMembership.user_id === membership.user_id && campaignMembership.role === 'GAME_MASTER',
    );
  }

  /**
   * Set active map id for drag and drop
   * @param event - Drag start event
   */
  function handleDragStart(event: DragStartEvent) {
    const activeId = event.active.id as string;
    setActiveId(activeId);
  }

  /**
   * Update order of maps when map is dragged over another map
   * @param event - Drag over event
   */
  function handleDragOver(event: DragOverEvent) {
    if (!event.over) return;

    const activeId = event.active.id as string;
    const overId = event.over.id as string;

    if (event.active.id !== event.over.id) {
      setOrderedMaps((orderedMaps) => {
        if (!orderedMaps) return [];
        const oldIndex = orderedMaps.findIndex((map) => map.id === activeId);
        const newIndex = orderedMaps.findIndex((map) => map.id === overId);

        return arrayMove(orderedMaps, oldIndex, newIndex);
      });
    }
  }

  /**
   * Send request to reorder maps if order has changed after drag end
   * @param event - Drag end event
   */
  function handleDragEnd(event: DragEndEvent) {
    if (!campaign || !maps || !orderedMaps || !event.over) return;

    // Check if order has changed
    if (orderedMaps.some((map, index) => map.id !== maps[index]!.id)) {
      reorderMaps({ campaignId: campaign.id, mapIds: orderedMaps.map((map) => map.id) });
    }
  }

  return (
    <Paper sx={{ background: 'rgba(0, 0, 0, 0.4)', overflow: 'hidden' }} ref={setNodeRef} style={style} {...attributes}>
      <Box
        onClick={() => onToggle?.(!expanded)}
        {...listeners}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          cursor: 'pointer',
          background: 'rgba(0, 0, 0, 0.1)',
          p: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: '1 0 auto' }}>
          <Typography variant="h3">
            {campaign ? campaign.name : <Skeleton width={MathUtils.getRandomBetween(100, 200)} />}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Typography variant="caption">
              {maps ? maps.length : <Skeleton width={10} sx={{ display: 'inline-block' }} />} map
              {!maps || maps.length === 1 ? '' : 's'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {memberships?.map((membership) => {
                const isGameMaster = isCampaignGameMaster(membership);

                return (
                  <Tooltip
                    key={membership.user_id}
                    title={
                      isGameMaster ? `${membership.user?.display_name} (Game Master)` : membership.user?.display_name
                    }
                  >
                    <span>
                      <UserAvatar profile={membership.user!} size="small" />
                    </span>
                  </Tooltip>
                );
              })}

              {invites?.map((invite) => (
                <Tooltip key={invite.id} title={invite.email}>
                  <Box sx={{ border: '2px dashed transparent', borderRadius: 90 }}>
                    <Avatar sx={{ width: 24, height: 24, opacity: 0.5 }} />
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} onClick={(event) => event.stopPropagation()}>
          {isGameMaster && (
            <>
              <Tooltip title="Update">
                <span>
                  <IconButton
                    onClick={() => {
                      if (!campaign) return;
                      setSelectedCampaignId(campaign.id);
                      setModal(CampaignModal.CreateUpdate);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Members">
                <span>
                  <IconButton
                    onClick={() => {
                      if (!campaign) return;
                      setSelectedCampaignId(campaign.id);
                      setModal(CampaignModal.Members);
                    }}
                  >
                    <People />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Plugins">
                <IconButton
                  onClick={() => {
                    if (!campaign) return;
                    setSelectedCampaignId(campaign.id);
                    setModal(CampaignModal.Plugins);
                  }}
                >
                  <Extension />
                </IconButton>
              </Tooltip>

              <PopupState variant="popover" popupId={`campaign-accordion-${campaign?.id}`}>
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
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                      <MenuList>
                        <MenuItem
                          onClick={() => {
                            if (!campaign) return;
                            setSelectedCampaignId(campaign.id);
                            setModal(CampaignModal.Delete);
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
            </>
          )}

          <Tooltip title={expanded ? 'Collapse' : 'Expand'}>
            <IconButton onClick={() => onToggle?.(!expanded)}>{expanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Collapse in={campaign ? (isDragging ? false : expanded) : true}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'inherit' },
            p: 3,
            gap: 3,
          }}
        >
          <DndContext
            id={`campaign-${campaign?.id}-maps`}
            sensors={sensors}
            modifiers={[restrictToParentElement]}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={orderedMaps!} strategy={rectSortingStrategy}>
              {orderedMaps ? (
                <>
                  {orderedMaps?.map((map) => (
                    <MapCard key={map.id} map={orderedMaps!.find((m) => m.id === map.id)} campaign={campaign} />
                  ))}
                </>
              ) : (
                <>
                  {[...Array(4)].map((item, index) => (
                    <MapCard key={index} />
                  ))}
                </>
              )}
            </SortableContext>

            <Portal>
              <DragOverlay modifiers={[restrictToParentElement]}>
                {activeId ? (
                  <MapCard key={activeId} map={orderedMaps?.find((map) => map.id === activeId)} campaign={campaign} />
                ) : null}
              </DragOverlay>
            </Portal>
          </DndContext>

          {isGameMaster && <NewMap campaign={campaign || null} />}
        </Box>
      </Collapse>
    </Paper>
  );
}