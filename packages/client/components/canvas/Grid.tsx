import React from 'react';

import { PixiGraphPaper } from './pixi/PixiGraphPaper';

interface IGridProps {
  width: number;
  height: number;
}

export const Grid: React.FC<IGridProps> = ({ width, height }) => {
  return <PixiGraphPaper graphWidth={width} graphHeight={height} minorGridSize={70} minorStrokeWidth={1} />;
};
