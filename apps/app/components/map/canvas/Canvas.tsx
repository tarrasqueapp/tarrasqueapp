import { Stage } from '@pixi/react';
import { QueryClientContext } from '@tanstack/react-query';
import * as PIXI from 'pixi.js';
import { useContext } from 'react';

import Loading from '@/app/loading';
import { useGetGrid } from '@/hooks/data/grids/useGetGrid';
import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Color } from '@/utils/colors';

import { Camera } from './Camera/Camera';
import { Grid } from './Grid';
import { GridAlignment } from './GridAlignment';
import { MapMedia } from './MapMedia';

export default function Canvas() {
  const { data: map } = useGetCurrentMap();
  const { data: grid } = useGetGrid(map?.id);
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

          {grid && (
            <>
              <Grid />
              <GridAlignment />
            </>
          )}
        </Camera>
      </QueryClientContext.Provider>
    </Stage>
  );
}
