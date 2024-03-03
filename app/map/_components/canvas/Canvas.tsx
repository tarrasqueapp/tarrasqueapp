import { Stage } from '@pixi/react';
import { QueryClientContext } from '@tanstack/react-query';
import * as PIXI from 'pixi.js';
import React, { useContext } from 'react';

import Loading from '@/app/loading';
import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Color } from '@/lib/colors';

import { Camera } from './Camera/Camera';
import { MapMedia } from './MapMedia';

export default function Canvas() {
  const { data: map } = useGetCurrentMap();
  const context = useContext(QueryClientContext);

  const windowSize = useWindowSize();

  if (!map?.media || !map.media.width || !map.media.height) {
    return <Loading />;
  }

  const backgroundColor = new PIXI.Color(Color.BLACK).toNumber();

  return (
    <Stage
      width={windowSize.width}
      height={windowSize.height}
      options={{ backgroundColor, antialias: true, eventMode: 'dynamic' }}
    >
      <QueryClientContext.Provider value={context}>
        <Camera mapId={map.id} width={map.media.width} height={map.media.height}>
          <MapMedia />
        </Camera>
      </QueryClientContext.Provider>
    </Stage>
  );
}
