import { useGetUserCampaigns } from '../../hooks/data/campaigns/useGetUserCampaigns';
import { Campaign } from './Campaign';

export const Campaigns: React.FC = () => {
  const { data: campaigns } = useGetUserCampaigns();

  return (
    <>
      {campaigns ? (
        campaigns?.map((campaign) => <Campaign key={campaign.id} campaign={campaign} />)
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
