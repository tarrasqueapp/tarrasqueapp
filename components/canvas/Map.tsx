import { Camera } from './Camera';
import { MapMedia } from './MapMedia';

export interface MapProps {
  mapId: string;
  width: number;
  height: number;
  url: string;
  children?: React.ReactNode;
}

export function Map({ mapId, width, height, url, children }: MapProps) {
  return (
    <Camera mapId={mapId} width={width} height={height}>
      <MapMedia url={url} />
      {children}
    </Camera>
  );
}
