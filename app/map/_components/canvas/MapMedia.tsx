import { Sprite } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useMemo } from 'react';

import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { supabaseLoader } from '@/lib/supabaseLoader';

export function MapMedia() {
  const { data: map } = useGetCurrentMap();

  // Get the map media URL
  const url = useMemo(() => {
    if (!map?.media) return '';
    return supabaseLoader({ src: map.media.url });
  }, [map]);

  if (!map?.media) return null;

  return <Sprite texture={PIXI.Texture.from(url)} x={0} y={0} anchor={0} />;
}
