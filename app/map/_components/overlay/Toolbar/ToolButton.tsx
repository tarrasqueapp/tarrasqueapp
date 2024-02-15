import styled from '@emotion/styled';
import { Button, ButtonProps } from '@mui/material';
import { ForwardedRef, forwardRef } from 'react';

import { Color } from '@/lib/colors';

export interface ToolButtonProps extends ButtonProps<'button'> {
  selected?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ToolButtonFwd = forwardRef(({ selected, ...props }: ToolButtonProps, ref: ForwardedRef<HTMLButtonElement>) => (
  <Button {...props} ref={ref} />
));
ToolButtonFwd.displayName = 'ToolButtonFwd';

// Add selected prop to ToolButton
export const ToolButton = styled(ToolButtonFwd)(({ selected }: { selected?: boolean }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  color: Color.WHITE_LIGHT,
  ...(selected && {
    background: `${Color.BROWN_MAIN} !important`,
  }),
  padding: '8px !important',
  minWidth: '0 !important',
}));
