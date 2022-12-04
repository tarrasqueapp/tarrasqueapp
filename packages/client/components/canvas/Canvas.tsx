import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Stage } from 'react-pixi-fiber';
import { io } from 'socket.io-client';

import { useGetCurrentMap } from '../../hooks/data/maps/useGetCurrentMap';
import { useWindowSize } from '../../hooks/useWindowSize';
import { store } from '../../store';
import { Grid } from './Grid';
import { Map } from './Map';
import { Token } from './Token';

const Canvas: React.FC = observer(() => {
  const { data: map } = useGetCurrentMap();
  const windowSize = useWindowSize();

  useEffect(() => {
    if (store.app.socket) return;
    store.app.setSocket(io({ path: '/socket.io' }));
  }, []);

  useEffect(() => {
    if (!store.app.socket || !map) return;

    store.app.socket.on('connect', () => {
      if (!map) return;
      console.debug('Connected');
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

  return (
    <Stage options={{ width: windowSize.width, height: windowSize.height, backgroundColor: 0x1a1818 }}>
      <Map mapId={map.id} width={map.media.width} height={map.media.height} url={map.media.url}>
        <Grid width={map.media.width} height={map.media.height} />
        <Token src="/token.webp" x={70} y={70} width={70} height={70} />
      </Map>
    </Stage>
  );
});

export default Canvas;
