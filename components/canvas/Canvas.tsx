import { Stage } from '@pixi/react';
import { QueryClientContext } from '@tanstack/react-query';
import { Color as PixiColor } from 'pixi.js';
import React, { useContext } from 'react';

import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { useGetTokens } from '@/hooks/data/tokens/useGetTokens';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Color } from '@/lib/colors';

import { Grid } from './Grid';
import { Map } from './Map';
import { PingLocation } from './PingLocation';
import { Token } from './Token';

export default function Canvas() {
  const { data: map } = useGetCurrentMap();
  // const { data: tokens } = useGetTokens(map?.id);
  const context = useContext(QueryClientContext);

  const windowSize = useWindowSize();

  if (!map?.media || !map.media.width || !map.media.height) return null;

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
      <QueryClientContext.Provider value={context}>
        <Map mapId={map.id} width={map.media.width} height={map.media.height} url={map.media.url}>
          <Grid width={map.media.width} height={map.media.height} size={70} color={Color.BLACK} />
          {/* {tokens?.map((token) => (
            <Token
              key={token.id}
              url={token.character?.media.thumbnail_url || ''}
              x={70}
              y={70}
              width={70}
              height={70}
            />
          ))} */}

          <PingLocation />
        </Map>
      </QueryClientContext.Provider>
    </Stage>
  );
}
