import React from 'react';

import { TokenBase } from './TokenBase';

interface ITokenProps {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const Token: React.FC<ITokenProps> = ({ url, x, y, width, height }) => {
  return <TokenBase src={url} x={x} y={y} width={width} height={height} />;
};
