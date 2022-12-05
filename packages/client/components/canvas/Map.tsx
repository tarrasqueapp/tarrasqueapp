import { Camera } from './Camera';
import { MapMedia } from './MapMedia';

export interface IMapProps {
  mapId: string;
  width: number;
  height: number;
  url: string;
  children?: React.ReactNode;
}

export const Map: React.FC<IMapProps> = ({ mapId, width, height, url, children }) => {
  return (
    <Camera mapId={mapId} width={width} height={height}>
      <MapMedia url={url} />
      {children}
    </Camera>
  );
};
