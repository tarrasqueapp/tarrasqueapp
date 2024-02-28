import styled from '@emotion/styled';
import { Button, ButtonProps } from '@mui/material';
import { ForwardedRef, forwardRef } from 'react';

import { Color } from '@/lib/colors';

interface DockButtonProps extends ButtonProps<'button'> {
  active?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DockButtonFwd = forwardRef(({ active, ...props }: DockButtonProps, ref: ForwardedRef<HTMLButtonElement>) => (
  <Button color="inherit" {...props} ref={ref} />
));
DockButtonFwd.displayName = 'DockButtonFwd';

// Add active prop to DockButton
export const DockButton = styled(DockButtonFwd)(({ active }: { active?: boolean }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  color: Color.WHITE_LIGHT,
  border: '1px solid transparent',
  ...(active && {
    border: `1px solid ${Color.BROWN_MAIN} !important`,
  }),
  borderRadius: '10px',
  padding: '8px !important',
  minWidth: '0 !important',
}));
