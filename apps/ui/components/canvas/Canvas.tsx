import { Stage } from '@pixi/react';
import { Color as PixiColor } from 'pixi.js';
import React, { useEffect } from 'react';

import { TarrasqueEvent, tarrasque } from '@tarrasque/sdk';

import { useGetCurrentMap } from '../../hooks/data/maps/useGetCurrentMap';
import { useGetTokens } from '../../hooks/data/tokens/useGetTokens';
import { useWindowSize } from '../../hooks/useWindowSize';
import { Color } from '../../lib/colors';
import { Providers } from '../Providers';
import { Grid } from './Grid';
import { Map } from './Map';
import { Token } from './Token';

export default function Canvas() {
  const { data: map } = useGetCurrentMap();
  const { data: tokens } = useGetTokens(map?.id);

  const windowSize = useWindowSize();

  // Set up event handlers for Socket.io events
  useEffect(() => {
    if (!tarrasque || !map) return;

    tarrasque.on(TarrasqueEvent.CONNECT, () => {
      if (!map) return;
      console.debug('Connected');
      // Emit a "joinMap" event to the server, passing the map ID
      tarrasque.emit(TarrasqueEvent.JOIN_MAP_ROOM, map.id);
    });

    tarrasque.on(TarrasqueEvent.PINGED_LOCATION, (mapId) => {
      console.debug('Pinged Location', mapId);
    });
  }, [tarrasque, map]);

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
          {tokens?.map((token) => (
            <Token
              key={token.id}
              url={
                token.character?.media?.find((media) => media.id === token.character?.selectedMediaId)?.thumbnailUrl ||
                ''
              }
              x={70}
              y={70}
              width={70}
              height={70}
            />
          ))}
        </Map>
      </Providers>
    </Stage>
  );
}
