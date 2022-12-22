import { Badge, Link, Tooltip, Typography, badgeClasses } from '@mui/material';

import { useGetLiveVersion } from '../../hooks/useGetLiveVersion';
import { config } from '../../lib/config';

export const Version: React.FC = () => {
  const { data: liveVersion } = useGetLiveVersion();

  const isLatest = liveVersion ? liveVersion.version === `v${config.VERSION}` : true;

  return (
    <Tooltip title={isLatest ? undefined : 'New version available'}>
      <Badge
        variant="dot"
        invisible={isLatest}
        color="info"
        sx={{ [`& .${badgeClasses.badge}`]: { right: -6, top: 6 } }}
      >
        <Link href="https://tarrasque.app/changelog" target="_blank" rel="noopener noreferrer" color="text.secondary">
          <Typography align="center" variant="h5" sx={{ fontSize: '11px !important' }}>
            v{config.VERSION}
          </Typography>
        </Link>
      </Badge>
    </Tooltip>
  );
};
