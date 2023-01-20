import { SvgIcon, SvgIconProps } from '@mui/material';

import characterIcon from '../../public/images/app-icons/character.svg';

export const CharacterIcon: React.FC<SvgIconProps> = (props) => {
  return <SvgIcon component={characterIcon} {...props} />;
};
