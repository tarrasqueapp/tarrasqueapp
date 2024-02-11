'use client';

import { Badge, Tooltip, Typography, badgeClasses } from '@mui/material';

import { ExternalLink } from '@/components/navigation/ExternalLink';
import { useGetLiveVersion } from '@/hooks/useGetLiveVersion';
import { config } from '@/lib/config';
import { ExternalNavigation } from '@/lib/navigation';

export function Version() {
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
        <ExternalLink href={ExternalNavigation.Changelog} color="text.secondary">
          <Typography variant="h5" sx={{ fontSize: '11px !important' }}>
            v{config.VERSION}
          </Typography>
        </ExternalLink>
      </Badge>
    </Tooltip>
  );
}
