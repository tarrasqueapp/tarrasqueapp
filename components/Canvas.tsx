import { Stage } from '@inlet/react-pixi';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { store } from '../store';
import { Grid } from './Grid';
import { Map } from './Map';
import { Token } from './Token';

const Canvas: React.FC = observer(() => {
  useEffect(() => {
    store.map.setDimensions(2450, 1400);
  }, []);

  if (!store.map.dimensions.width || !store.map.dimensions.height) return null;

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} options={{ backgroundColor: 0x171717 }}>
      <Map src="/map.webp" width={store.map.dimensions.width} height={store.map.dimensions.height}>
        <Grid
          graphWidth={store.map.dimensions.width}
          graphHeight={store.map.dimensions.height}
          minorGridSize={70}
          minorStrokeWidth={1}
        />
        <Token src="/token.webp" x={70} y={70} width={70} height={70} />
      </Map>
    </Stage>
  );
});

export default Canvas;
