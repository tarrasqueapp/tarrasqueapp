import { Stage } from '@pixi/react';
import { QueryClientContext } from '@tanstack/react-query';
import * as PIXI from 'pixi.js';
import React, { useContext, useEffect } from 'react';

import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Color } from '@/lib/colors';
import { supabaseLoader } from '@/lib/supabaseLoader';
import { usePixiStore } from '@/store/pixi';

import { Camera } from './Camera';
import { Grid } from './Grid';
import { MapMedia } from './MapMedia';

export default function Canvas() {
  const { data: map } = useGetCurrentMap();
  const context = useContext(QueryClientContext);

  const setMap = usePixiStore((state) => state.setMap);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (!map) return;
    setMap(map);
  }, [map]);

  if (!map?.media || !map.media.width || !map.media.height) return null;

  const backgroundColor = new PIXI.Color(Color.BLACK).toNumber();

  return (
    <Stage
      width={windowSize.width}
      height={windowSize.height}
      options={{ backgroundColor, antialias: true, eventMode: 'dynamic' }}
    >
      <QueryClientContext.Provider value={context}>
        <Camera mapId={map.id} width={map.media.width} height={map.media.height}>
          <MapMedia url={supabaseLoader({ src: map.media.url })} />

          <Grid size={70} color="rgba(255, 255, 255, 0.08)" />
        </Camera>
      </QueryClientContext.Provider>
    </Stage>
  );
}
