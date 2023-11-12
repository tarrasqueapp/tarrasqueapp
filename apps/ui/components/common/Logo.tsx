import { Box, BoxProps } from '@mui/material';
import React from 'react';

interface LogoProps extends BoxProps {
  size?: number;
}

export function Logo({ size, ...props }: LogoProps) {
  return <Box component="img" src="/images/logo.svg" alt="Tarrasque App Logo" width={size} height={size} {...props} />;
}
