import { SvgIcon, SvgIconProps } from '@mui/material';

import discordIcon from '@/public/images/app-icons/discord.svg';

export function DiscordIcon(props: SvgIconProps) {
  return <SvgIcon component={discordIcon} {...props} />;
}
