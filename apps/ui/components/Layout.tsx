import { CircularProgress, Tooltip } from '@mui/material';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import React, { ReactNode } from 'react';

import { useGetUser } from '../hooks/data/users/useGetUser';

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  useGetUser();

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
};
