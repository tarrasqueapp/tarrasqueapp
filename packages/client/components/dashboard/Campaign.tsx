import { useGetCampaignMaps } from '../../hooks/data/maps/useGetCampaignMaps';
import { CampaignBase, ICampaignBaseProps } from './CampaignBase';

export const Campaign: React.FC<ICampaignBaseProps> = (props) => {
  const { data: maps } = useGetCampaignMaps(props.campaign?.id);

  return <CampaignBase {...props} maps={maps} />;
};
