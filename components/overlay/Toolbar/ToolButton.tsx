import styled from '@emotion/styled';
import { Button, ButtonProps } from '@mui/material';
import { forwardRef } from 'react';

import { Color } from '@/lib/colors';

interface ToolButtonProps extends ButtonProps<any> {
  selected?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ToolButtonFwd = forwardRef(({ selected, ...props }: ToolButtonProps, ref: any) => (
  <Button {...props} ref={ref} />
));
ToolButtonFwd.displayName = 'ToolButtonFwd';

// Add selected prop to ToolButton
export const ToolButton = styled(ToolButtonFwd)(({ selected }: { selected?: boolean }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  color: Color.WHITE,
  ...(selected && {
    background: `${Color.BROWN_BEIGE} !important`,
  }),
  padding: '8px !important',
  minWidth: '0 !important',
}));
