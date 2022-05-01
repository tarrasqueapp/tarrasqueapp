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
    if (store.app.socket) return;
    store.app.setSocket(io());
  }, []);

  useEffect(() => {
    if (!store.app.socket || !store.maps.currentMap) return;

    store.app.socket.on('connect', () => {
      if (!store.maps.currentMap) return;
      console.log('Connected');
      store.app.socket.emit('joinMap', store.maps.currentMap?.id);
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
  }, [store.app.socket, store.maps.currentMap]);

  if (!store.maps.currentMap) return null;

  return (
    <Stage width={windowSize.width} height={windowSize.height} options={{ backgroundColor: 0x171717 }}>
      <Map
        src={store.maps.currentMap.media.url}
        width={store.maps.currentMap.media.width}
        height={store.maps.currentMap.media.height}
      >
        <>
          <Grid
            graphWidth={store.maps.currentMap.media.width}
            graphHeight={store.maps.currentMap.media.height}
            minorGridSize={70}
            minorStrokeWidth={1}
          />
          <Token src="/token.webp" x={70} y={70} width={70} height={70} />
        </>
      </Map>
    </Stage>
  );
});

export default Canvas;
