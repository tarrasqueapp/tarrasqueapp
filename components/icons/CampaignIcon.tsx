import { SvgIcon, SvgIconProps } from '@mui/material';

import campaignIcon from '../../public/images/app-icons/campaign.svg';

export function CampaignIcon(props: SvgIconProps) {
  return <SvgIcon component={campaignIcon} {...props} />;
}
