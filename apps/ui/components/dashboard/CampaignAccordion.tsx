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
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete, Edit, ExpandLess, ExpandMore, MoreHoriz, People } from '@mui/icons-material';
import {
  Box,
  Collapse,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { useEffect, useState } from 'react';

import { useGetUser } from '../../hooks/data/auth/useGetUser';
import { useGetCampaignMaps } from '../../hooks/data/maps/useGetCampaignMaps';
import { useReorderMaps } from '../../hooks/data/maps/useReorderMaps';
import { CampaignEntity, CampaignMemberRole } from '../../lib/types';
import { store } from '../../store';
import { CampaignModal } from '../../store/campaigns';
import { MathUtils } from '../../utils/MathUtils';
import { MapCard } from './MapCard';
import { NewMap } from './NewMap';

export interface CampaignAccordionProps {
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  campaign?: CampaignEntity;
}

export function CampaignAccordion({ expanded, onToggle, campaign }: CampaignAccordionProps) {
  const { data: user } = useGetUser();
  const { data: maps } = useGetCampaignMaps(campaign?.id);
  const reorderMaps = useReorderMaps();

  // Drag and drop
  const [activeId, setActiveId] = useState<string | null>(null);
  const [orderedMapIds, setOrderedMapIds] = useState<string[]>([]);
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
    if (!maps) return;
    setOrderedMapIds(maps.map((map) => map.id));
  }, [maps]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging && { opacity: 0.5 }),
  };

  const isGameMaster =
    campaign?.createdById === user?.id ||
    campaign?.members.some((member) => member.id === user?.id && member.role === CampaignMemberRole.GAME_MASTER);

  /**
   * Set active map id for drag and drop
   * @param event - Drag start event
   */
  function handleDragStart(event: DragStartEvent) {
    const activeId = event.active.id as string;
    setActiveId(activeId);
  }

  /**
   * Update order of map ids when map is dragged over another map
   * @param event - Drag over event
   */
  function handleDragOver(event: DragOverEvent) {
    if (!campaign || !maps || !event.over) return;

    const activeId = event.active.id as string;
    const overId = event.over.id as string;

    if (event.active.id !== event.over.id) {
      const oldIndex = orderedMapIds.indexOf(activeId);
      const newIndex = orderedMapIds.indexOf(overId);

      // Update order of map ids
      setOrderedMapIds((orderedMapIds) => {
        const newMapIds = [...orderedMapIds];
        newMapIds.splice(oldIndex, 1);
        newMapIds.splice(newIndex, 0, activeId);
        return newMapIds;
      });
    }
  }

  /**
   * Send request to reorder maps if order has changed after drag end
   * @param event - Drag end event
   */
  function handleDragEnd(event: DragEndEvent) {
    if (!campaign || !maps || !event.over) return;

    // Check if order has changed
    if (orderedMapIds.some((mapId, index) => mapId !== maps[index].id)) {
      reorderMaps.mutate({ campaignId: campaign.id, mapIds: orderedMapIds });
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

          <Typography variant="caption">
            {maps ? maps.length : <Skeleton width={10} sx={{ display: 'inline-block' }} />} map
            {!maps || maps.length === 1 ? '' : 's'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex' }} onClick={(event) => event.stopPropagation()}>
          <Tooltip title="Update">
            <span>
              <IconButton
                disabled={!isGameMaster}
                onClick={() => {
                  if (!campaign) return;
                  store.campaigns.setSelectedCampaignId(campaign.id);
                  store.campaigns.setModal(CampaignModal.CreateUpdate);
                }}
              >
                <Edit />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Members">
            <span>
              <IconButton
                disabled={!isGameMaster}
                onClick={() => {
                  if (!campaign) return;
                  store.campaigns.setSelectedCampaignId(campaign.id);
                  store.campaigns.setModal(CampaignModal.Members);
                }}
              >
                <People />
              </IconButton>
            </span>
          </Tooltip>

          <PopupState variant="popover" popupId={`campaign-accordion-${campaign?.id}`}>
            {(popupState) => (
              <>
                <Tooltip title="More">
                  <span>
                    <IconButton {...bindTrigger(popupState)} disabled={!isGameMaster}>
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
                        store.campaigns.setSelectedCampaignId(campaign.id);
                        store.campaigns.setModal(CampaignModal.Delete);
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
            sensors={sensors}
            modifiers={[restrictToParentElement]}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={orderedMapIds} strategy={rectSortingStrategy}>
              {maps ? (
                orderedMapIds?.map((mapId) => (
                  <MapCard key={mapId} map={maps?.find((map) => map.id === mapId)} campaign={campaign} />
                ))
              ) : (
                <>
                  {[...Array(8)].map((item, index) => (
                    <MapCard key={index} />
                  ))}
                </>
              )}
            </SortableContext>

            <DragOverlay modifiers={[restrictToParentElement]}>
              {activeId ? <MapCard key={activeId} map={maps?.find((map) => map.id === activeId)} /> : null}
            </DragOverlay>
          </DndContext>

          {isGameMaster && <NewMap campaign={campaign || null} />}
        </Box>
      </Collapse>
    </Paper>
  );
}
