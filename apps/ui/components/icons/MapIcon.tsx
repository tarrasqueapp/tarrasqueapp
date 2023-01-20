import { SvgIcon, SvgIconProps } from '@mui/material';

import mapIcon from '../../public/images/app-icons/map.svg';

export const MapIcon: React.FC<SvgIconProps> = (props) => {
  return <SvgIcon component={mapIcon} {...props} />;
};
