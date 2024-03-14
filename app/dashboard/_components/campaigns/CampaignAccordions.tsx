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

import { Campaign, reorderCampaigns } from '@/actions/campaigns';
import { useGetUserCampaigns } from '@/hooks/data/campaigns/useGetUserCampaigns';

import { CampaignAccordion } from './CampaignAccordion';
import { NewCampaign } from './NewCampaign';

interface Props {
  collapsedCampaigns: string[];
}

export function CampaignAccordions({ collapsedCampaigns: initialCollapsedCampaigns }: Props) {
  const { data: campaigns } = useGetUserCampaigns();

  const [collapsedCampaigns, setCollapsedCampaigns] = useState<string[]>(initialCollapsedCampaigns || []);

  // Drag and drop
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [orderedCampaigns, setOrderedCampaigns] = useState<Campaign[]>(campaigns || []);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 500, tolerance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Set initial order of campaign ids and update when campaigns change
  useEffect(() => {
    setOrderedCampaigns(campaigns || []);
  }, [campaigns]);

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
    if (orderedCampaigns.some((campaign, index) => campaign.id !== campaigns[index]!.id)) {
      const campaignIds = orderedCampaigns.map((campaign) => campaign.id);
      reorderCampaigns({ campaignIds });
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
            <React.Fragment key={campaign.id}>
              <CampaignAccordion
                campaign={orderedCampaigns?.find((c) => c.id === campaign.id)}
                expanded={!collapsedCampaigns?.includes(campaign.id)}
                onToggle={(expanded) => handleToggle(campaign.id, expanded)}
              />
            </React.Fragment>
          ))}
        </SortableContext>

        <Portal>
          <DragOverlay modifiers={[restrictToParentElement]}>
            {activeId ? (
              <CampaignAccordion
                key={activeId}
                campaign={orderedCampaigns?.find((campaign) => campaign.id === activeId)}
              />
            ) : null}
          </DragOverlay>
        </Portal>
      </DndContext>

      <NewCampaign />
    </>
  );
}
