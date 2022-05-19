import { Stage } from '@inlet/react-pixi';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

import { useGetMap } from '../hooks/data/maps/useGetMap';
import { useWindowSize } from '../hooks/useWindowSize';
import { store } from '../store';
import { Grid } from './Grid';
import { Map } from './Map';
import { Token } from './Token';

const Canvas: React.FC = observer(() => {
  const router = useRouter();
  const { data: map } = useGetMap(router.query.mapId as string);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (store.app.socket) return;
    store.app.setSocket(io({ path: `${router.basePath}/socket.io` }));
  }, []);

  useEffect(() => {
    if (!store.app.socket || !map) return;

    store.app.socket.on('connect', () => {
      if (!map) return;
      console.log('Connected');
      store.app.socket.emit('joinMap', map?.id);
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
  }, [store.app.socket, map]);

  if (!map) return null;

  return (
    <Stage width={windowSize.width} height={windowSize.height} options={{ backgroundColor: 0x1a1818 }}>
      <Map src={map.media.url} width={map.media.width} height={map.media.height}>
        <>
          <Grid graphWidth={map.media.width} graphHeight={map.media.height} minorGridSize={70} minorStrokeWidth={1} />
          <Token src={`${router.basePath}/token.webp`} x={70} y={70} width={70} height={70} />
        </>
      </Map>
    </Stage>
  );
});

export default Canvas;
