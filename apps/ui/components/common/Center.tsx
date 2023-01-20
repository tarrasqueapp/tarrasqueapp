import { Box } from '@mui/material';

import { Gradient } from '../../lib/colors';

interface CenterProps {
  children: React.ReactNode;
}

export const Center: React.FC<CenterProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: '1 0 auto',
        background: Gradient.Linear,
        py: 1,
      }}
    >
      {children}
    </Box>
  );
};
