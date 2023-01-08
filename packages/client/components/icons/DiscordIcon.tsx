import { SvgIcon, SvgIconProps } from '@mui/material';

import discordIcon from '../../public/images/app-icons/discord.svg';

export const DiscordIcon: React.FC<SvgIconProps> = (props) => {
  return <SvgIcon component={discordIcon} {...props} />;
};
