import { useGetCampaignMaps } from '../../hooks/data/maps/useGetCampaignMaps';
import { CampaignInterface } from '../../lib/types';
import { CampaignBase } from './CampaignBase';

interface ICampaignProps {
  campaign: CampaignInterface;
}

export const Campaign: React.FC<ICampaignProps> = ({ campaign }) => {
  const { data: maps } = useGetCampaignMaps(campaign.id);

  return <CampaignBase campaign={campaign} maps={maps} />;
};
