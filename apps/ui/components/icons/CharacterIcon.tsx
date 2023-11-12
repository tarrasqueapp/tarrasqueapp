import { SvgIcon, SvgIconProps } from '@mui/material';

import characterIcon from '../../public/images/app-icons/character.svg';

export function CharacterIcon(props: SvgIconProps) {
  return <SvgIcon component={characterIcon} {...props} />;
}
