import { SvgIcon, SvgIconProps } from '@mui/material';

import campaignIcon from '../../public/images/app-icons/campaign.svg';

export const CampaignIcon: React.FC<SvgIconProps> = (props) => {
  return <SvgIcon component={campaignIcon} {...props} />;
};
