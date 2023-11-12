import { CircularProgress, Tooltip } from '@mui/material';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import React from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  return (
    <>
      {children}

      {Boolean(isFetching || isMutating) && (
        <Tooltip title="Saving...">
          <CircularProgress size={16} disableShrink sx={{ position: 'absolute', bottom: 4, right: 4 }} />
        </Tooltip>
      )}
    </>
  );
}
