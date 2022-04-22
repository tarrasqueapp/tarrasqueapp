import { Stage } from '@inlet/react-pixi';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

import { useWindowSize } from '../hooks/useWindowSize';
import { store } from '../store';
import { Grid } from './Grid';
import { Map } from './Map';
import { Token } from './Token';

const Canvas: React.FC = observer(() => {
  const windowSize = useWindowSize();

  useEffect(() => {
    store.app.setSocket(io());

    store.map.setDimensions(2450, 1400);
    store.app.socket.on('connect', () => {
      console.log('Connected');
      store.app.socket.emit('joinMap', store.map.id);
    });
    store.app.socket.on('pingLocation', (data) => {
      console.log('pingLocation', data);
    });
    store.app.socket.on('exception', (data) => {
      console.log('exception', data);
    });
    store.app.socket.on('disconnect', () => {
      console.log('Disconnected');
    });
  }, []);

  if (!store.map.id || !store.map.dimensions.width || !store.map.dimensions.height) return null;

  return (
    <Stage width={windowSize.width} height={windowSize.height} options={{ backgroundColor: 0x171717 }}>
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
