import useLocalStorage from 'use-local-storage';

import { useGetUserCampaigns } from '../../hooks/data/campaigns/useGetUserCampaigns';
import { Campaign } from './Campaign';

export const Campaigns: React.FC = () => {
  const { data: campaigns } = useGetUserCampaigns();

  const [collapsedCampaigns, setCollapsedCampaigns] = useLocalStorage<string[]>('campaigns-collapsed', []);

  /**
   * Handle toggling the expanded state of a campaign
   * @param campaignId The ID of the campaign to toggle
   * @param expanded The new expanded state of the campaign
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
      {campaigns ? (
        campaigns?.map((campaign) => (
          <Campaign
            key={campaign.id}
            campaign={campaign}
            expanded={!collapsedCampaigns.includes(campaign.id)}
            onToggle={(expanded) => handleToggle(campaign.id, expanded)}
          />
        ))
      ) : (
        <>
          <Campaign key={Math.random()} />
          <Campaign key={Math.random()} />
          <Campaign key={Math.random()} />
          <Campaign key={Math.random()} />
        </>
      )}
    </>
  );
};
