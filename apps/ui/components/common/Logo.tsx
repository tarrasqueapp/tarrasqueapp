import { Box, BoxProps } from '@mui/material';
import React from 'react';

interface LogoProps extends BoxProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size, ...props }) => {
  return <Box component="img" src="/images/logo.svg" alt="Tarrasque App Logo" width={size} height={size} {...props} />;
};
