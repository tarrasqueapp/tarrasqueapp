import { Box } from '@mui/material';

import { Gradient } from '@/lib/colors';

interface CenterProps {
  children: React.ReactNode;
}

export function Center({ children }: CenterProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: '1 0 auto',
        background: Gradient.LINEAR,
        py: 1,
      }}
    >
      {children}
    </Box>
  );
}
