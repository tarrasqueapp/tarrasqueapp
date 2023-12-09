import { SvgIcon, SvgIconProps } from '@mui/material';

import mapIcon from '@/public/images/app-icons/map.svg';

export function MapIcon(props: SvgIconProps) {
  return <SvgIcon component={mapIcon} {...props} />;
}
