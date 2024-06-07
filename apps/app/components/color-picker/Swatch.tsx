import { Avatar, IconButton, IconButtonProps } from '@mui/material';

interface Props extends IconButtonProps {
  value: string;
}

export function Swatch({ value, ...props }: Props) {
  return (
    <IconButton {...props}>
      <Avatar sx={{ width: 25, height: 25, backgroundColor: `${value}`, border: '1px solid rgba(255, 255, 255, 0.4)' }}>
        &nbsp;
      </Avatar>
    </IconButton>
  );
}
