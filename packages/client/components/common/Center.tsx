import { Box } from '@mui/material';

import { Gradient } from '../../lib/colors';

interface IProps {
  children: React.ReactNode;
}

export const Center: React.FC<IProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: '1 0 auto',
        background: Gradient.Linear,
      }}
    >
      {children}
    </Box>
  );
};
