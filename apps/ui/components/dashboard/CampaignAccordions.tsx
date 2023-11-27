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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Portal } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { CampaignEntity } from '@tarrasque/common';

import { useGetUserCampaigns } from '../../hooks/data/campaigns/useGetUserCampaigns';
import { useReorderCampaigns } from '../../hooks/data/campaigns/useReorderCampaigns';
import { CampaignAccordion } from './CampaignAccordion';
import { NewCampaign } from './NewCampaign';

export function CampaignAccordions() {
  const { data: campaigns } = useGetUserCampaigns();
  const reorderCampaigns = useReorderCampaigns();

  // Expand/collapse
  const [cookies, setCookie, removeCookie] = useCookies(['campaigns/collapsed']);
  // Get collapsed campaigns from cookies as array
  const collapsedCampaigns = cookies['campaigns/collapsed']?.split(',') || [];

  // Drag and drop
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [orderedCampaigns, setOrderedCampaigns] = useState<CampaignEntity[]>(campaigns || []);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 500, tolerance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Set initial order of campaign ids and update when campaigns change
  useEffect(() => {
    if (!campaigns) return;
    setOrderedCampaigns(campaigns);
  }, [campaigns]);

  /**
   * Handle toggling the expanded state of a campaign
   * @param campaignId - The ID of the campaign to toggle
   * @param expanded - The new expanded state of the campaign
   */
  function handleToggle(campaignId: string, expanded: boolean) {
    if (!campaignId) return;

    if (expanded) {
      const index = collapsedCampaigns.indexOf(campaignId);
      if (index > -1) collapsedCampaigns.splice(index, 1);
    } else {
      collapsedCampaigns.push(campaignId);
    }

    if (collapsedCampaigns.length === 0) {
      // Remove cookie if no campaigns are collapsed
      removeCookie('campaigns/collapsed', { path: '/' });
    } else {
      // Set cookie of collapsed campaigns as comma separated string
      setCookie('campaigns/collapsed', collapsedCampaigns.join(','), { path: '/' });
    }
  }

  /**
   * Set active campaign id for drag and drop
   * @param event - Drag start event
   */
  function handleDragStart(event: DragStartEvent) {
    const activeId = event.active.id as string;
    setActiveId(activeId);
  }

  /**
   * Update order of campaigns when campaign is dragged over another campaign
   * @param event - Drag over event
   */
  function handleDragOver(event: DragOverEvent) {
    if (!campaigns || !event.over) return;

    const activeId = event.active.id as string;
    const overId = event.over.id as string;

    if (event.active.id !== event.over.id) {
      setOrderedCampaigns((orderedCampaigns) => {
        const oldIndex = orderedCampaigns.findIndex((campaign) => campaign.id === activeId);
        const newIndex = orderedCampaigns.findIndex((campaign) => campaign.id === overId);

        return arrayMove(orderedCampaigns, oldIndex, newIndex);
      });
    }
  }

  /**
   * Send request to reorder campaigns if order has changed after drag end
   * @param event - Drag end event
   */
  function handleDragEnd(event: DragEndEvent) {
    if (!campaigns || !event.over) return;

    // Check if order has changed
    if (orderedCampaigns.some((campaign, index) => campaign.id !== campaigns[index].id)) {
      reorderCampaigns.mutate(orderedCampaigns.map((campaign) => campaign.id));
    }
  }

  return (
    <>
      <DndContext
        id="campaigns"
        sensors={sensors}
        modifiers={[restrictToParentElement]}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={orderedCampaigns} strategy={verticalListSortingStrategy}>
          {orderedCampaigns?.map((campaign) => (
            <CampaignAccordion
              key={campaign.id}
              campaign={campaigns?.find((c) => c.id === campaign.id)}
              expanded={!collapsedCampaigns?.includes(campaign.id)}
              onToggle={(expanded) => handleToggle(campaign.id, expanded)}
            />
          ))}
        </SortableContext>

        <Portal>
          <DragOverlay modifiers={[restrictToParentElement]}>
            {activeId ? (
              <CampaignAccordion key={activeId} campaign={campaigns?.find((campaign) => campaign.id === activeId)} />
            ) : null}
          </DragOverlay>
        </Portal>
      </DndContext>

      <NewCampaign />
    </>
  );
}
