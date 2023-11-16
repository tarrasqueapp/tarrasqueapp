import { Stage } from '@pixi/react';
import { observer } from 'mobx-react-lite';
import { Color as PixiColor } from 'pixi.js';
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

import { useGetCurrentMap } from '../../hooks/data/maps/useGetCurrentMap';
import { useWindowSize } from '../../hooks/useWindowSize';
import { Color } from '../../lib/colors';
import { store } from '../../store';
import { Providers } from '../Providers';
import { Grid } from './Grid';
import { Map } from './Map';
import { Token } from './Token';

const Canvas = observer(function Canvas() {
  const { data: map } = useGetCurrentMap();

  const windowSize = useWindowSize();

  // Establish a new Socket.io connection
  useEffect(() => {
    if (store.app.socket) return;
    store.app.setSocket(io({ path: '/socket.io' }));
  }, []);

  // Set up event handlers for Socket.io events
  useEffect(() => {
    if (!store.app.socket || !map) return;

    store.app.socket.on('connect', () => {
      if (!map) return;
      console.debug('Connected');
      // Emit a "joinMap" event to the server, passing the map ID
      store.app.socket.emit('joinMap', map.id);
    });

    store.app.socket.on('pingLocation', (data) => {
      console.debug('pingLocation', data);
    });

    store.app.socket.on('exception', (data) => {
      console.debug('exception', data);
    });

    store.app.socket.on('disconnect', () => {
      console.debug('Disconnected');
    });
  }, [store.app.socket, map]);

  if (!map) return null;

  const media = map.media.find((media) => media.id === map.selectedMediaId)!;
  const backgroundColor = new PixiColor(Color.BLACK).toNumber();

  return (
    <Stage
      width={windowSize.width}
      height={windowSize.height}
      options={{
        backgroundColor,
        antialias: true,
        eventMode: 'dynamic',
      }}
    >
      <Providers>
        <Map mapId={map.id} width={media.width} height={media.height} url={media.url}>
          <Grid width={media.width} height={media.height} size={70} color={Color.BLACK} />
          <Token url="https://cdn.tarrasque.app/sample/token.webp" x={70} y={70} width={70} height={70} />
        </Map>
      </Providers>
    </Stage>
  );
});

export default Canvas;
