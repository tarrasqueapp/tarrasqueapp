import React, { ReactNode } from 'react';

import { useGetRefreshToken } from '../hooks/data/users/useGetRefreshToken';

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  useGetRefreshToken();

  return <>{children}</>;
};
