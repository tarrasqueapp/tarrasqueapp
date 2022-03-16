import { Stage } from '@inlet/react-pixi';
import React from 'react';

import { Grid } from './Grid';
import { Map } from './Map';
import { Token } from './Token';

const Canvas: React.FC = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const MAP_WIDTH = 2450;
  const MAP_HEIGHT = 1400;

  return (
    <Stage width={width} height={height} options={{ backgroundColor: 0x171717 }}>
      <Map src="/map.webp" width={MAP_WIDTH} height={MAP_HEIGHT}>
        <Grid graphWidth={MAP_WIDTH} graphHeight={MAP_HEIGHT} minorGridSize={70} minorStrokeWidth={1} />
        <Token src="/token.webp" x={70} y={70} width={70} height={70} />
      </Map>
    </Stage>
  );
};

export default Canvas;
