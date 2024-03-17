'use client';

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
import { deleteCookie, setCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';

import { reorderCampaigns } from '@/actions/campaigns';
import { useGetUserCampaignMemberships } from '@/hooks/data/campaigns/memberships/useGetUserCampaignMemberships';

import { CampaignAccordion } from './CampaignAccordion';
import { NewCampaign } from './NewCampaign';

interface Props {
  collapsedCampaigns: string[];
}

export function CampaignAccordions({ collapsedCampaigns: initialCollapsedCampaigns }: Props) {
  const { data: campaignMemberships } = useGetUserCampaignMemberships({});

  const [collapsedCampaigns, setCollapsedCampaigns] = useState<string[]>(initialCollapsedCampaigns || []);

  // Drag and drop
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [orderedCampaignIds, setOrderedCampaignIds] = useState<string[]>(
    campaignMemberships?.map((membership) => membership.campaign_id) || [],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 500, tolerance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Set initial order of campaign ids and update when campaigns change
  useEffect(() => {
    setOrderedCampaignIds(campaignMemberships?.map((membership) => membership.campaign_id) || []);
  }, [campaignMemberships]);

  /**
   * Handle toggling the expanded state of a campaign
   * @param campaignId - The ID of the campaign to toggle
   * @param expanded - The new expanded state of the campaign
   */
  function handleToggle(campaignId: string, expanded: boolean) {
    if (!campaignId) return;

    const updatedCollapsedCampaigns = [...collapsedCampaigns];

    if (expanded) {
      const index = updatedCollapsedCampaigns.indexOf(campaignId);
      if (index > -1) updatedCollapsedCampaigns.splice(index, 1);
    } else {
      updatedCollapsedCampaigns.push(campaignId);
    }

    if (updatedCollapsedCampaigns.length === 0) {
      // Remove cookie if no campaigns are collapsed
      deleteCookie('campaigns/collapsed');
      setCollapsedCampaigns([]);
    } else {
      // Set cookie of collapsed campaigns as comma separated string
      setCookie('campaigns/collapsed', updatedCollapsedCampaigns.join(','));
      setCollapsedCampaigns([...updatedCollapsedCampaigns]);
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
    if (!campaignMemberships || !event.over) return;

    const activeId = event.active.id as string;
    const overId = event.over.id as string;

    if (event.active.id !== event.over.id) {
      setOrderedCampaignIds((orderedCampaignIds) => {
        const oldIndex = orderedCampaignIds.findIndex((campaignId) => campaignId === activeId);
        const newIndex = orderedCampaignIds.findIndex((campaignId) => campaignId === overId);

        return arrayMove(orderedCampaignIds, oldIndex, newIndex);
      });
    }
  }

  /**
   * Send request to reorder campaigns if order has changed after drag end
   * @param event - Drag end event
   */
  function handleDragEnd(event: DragEndEvent) {
    if (!campaignMemberships || !event.over) return;

    // Check if order has changed
    if (orderedCampaignIds.some((campaignId, index) => campaignId !== campaignMemberships[index]?.campaign_id)) {
      reorderCampaigns({ campaignIds: orderedCampaignIds });
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
        <SortableContext items={orderedCampaignIds} strategy={verticalListSortingStrategy}>
          {orderedCampaignIds?.map((campaignId) => (
            <CampaignAccordion
              key={campaignId}
              campaignId={campaignId}
              expanded={!collapsedCampaigns?.includes(campaignId)}
              onToggle={(expanded) => handleToggle(campaignId, expanded)}
            />
          ))}
        </SortableContext>

        <Portal>
          <DragOverlay modifiers={[restrictToParentElement]}>
            {activeId ? <CampaignAccordion key={activeId} campaignId={String(activeId)} /> : null}
          </DragOverlay>
        </Portal>
      </DndContext>

      <NewCampaign />
    </>
  );
}
