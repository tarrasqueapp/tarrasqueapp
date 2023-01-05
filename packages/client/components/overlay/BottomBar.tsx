import { Box, IconButton, Tooltip, alpha, styled } from '@mui/material';
import NextLink from 'next/link';

import { Color } from '../../lib/colors';
import { AppNavigation } from '../../lib/navigation';
import { CampaignIcon } from '../icons/CampaignIcon';

const CustomIconButton = styled(IconButton)({
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
});

export const BottomBar: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: alpha(Color.BlackLight, 0.9),
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        p: 1,
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 0 auto' }} />

      <Tooltip title="Dashboard" followCursor={false}>
        <NextLink href={AppNavigation.Dashboard} passHref>
          <CustomIconButton>
            <CampaignIcon fontSize="large" />
          </CustomIconButton>
        </NextLink>
      </Tooltip>
    </Box>
  );
};
