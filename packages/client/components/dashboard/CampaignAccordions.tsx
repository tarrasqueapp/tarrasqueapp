import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import useLocalStorage from 'use-local-storage';

import { useGetUserCampaigns } from '../../hooks/data/campaigns/useGetUserCampaigns';
import { useReorderCampaigns } from '../../hooks/data/campaigns/useReorderCampaigns';
import { CampaignAccordion } from './CampaignAccordion';
import { NewCampaign } from './NewCampaign';

export const CampaignAccordions: React.FC = () => {
  const { data: campaigns } = useGetUserCampaigns();
  const reorderCampaigns = useReorderCampaigns();

  const [collapsedCampaigns, setCollapsedCampaigns] = useLocalStorage<string[]>('campaigns-collapsed', []);
  const [activeId, setActiveId] = useState<string | number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 500, tolerance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /**
   * Handle toggling the expanded state of a campaign
   * @param campaignId - The ID of the campaign to toggle
   * @param expanded - The new expanded state of the campaign
   */
  function handleToggle(campaignId: string, expanded: boolean) {
    if (!campaignId) return;

    const newCollapsedCampaigns = [...collapsedCampaigns];

    if (expanded) {
      const index = collapsedCampaigns.indexOf(campaignId);
      if (index > -1) newCollapsedCampaigns.splice(index, 1);
    } else {
      newCollapsedCampaigns.push(campaignId);
    }

    setCollapsedCampaigns(newCollapsedCampaigns);
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => {
          if (event.active.id) setActiveId(event.active.id);
        }}
        onDragEnd={(event) => {
          if (event.active.id) setActiveId(null);

          if (event.over && event.active.id !== event.over.id) {
            const campaignOrder = campaigns?.map((campaign) => campaign.id) || [];
            const oldIndex = campaignOrder.indexOf(event.active.id as string);
            const newIndex = campaignOrder.indexOf(event.over.id as string);
            campaignOrder.splice(newIndex, 0, campaignOrder.splice(oldIndex, 1)[0]);
            reorderCampaigns.mutate(campaignOrder);
          }
        }}
      >
        <SortableContext items={campaigns || []} strategy={verticalListSortingStrategy}>
          {campaigns ? (
            campaigns?.map((campaign) => (
              <CampaignAccordion
                key={campaign.id}
                campaign={campaign}
                expanded={!collapsedCampaigns.includes(campaign.id)}
                onToggle={(expanded) => handleToggle(campaign.id, expanded)}
              />
            ))
          ) : (
            <>
              {[...Array(4)].map((item, index) => (
                <CampaignAccordion key={index} />
              ))}
            </>
          )}
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <CampaignAccordion key={activeId} campaign={campaigns?.find((campaign) => campaign.id === activeId)} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <NewCampaign />
    </>
  );
};
