export interface Dimensions {
  width: number;
  height: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface PingLocationEntity {
  id?: string;
  coordinates: Coordinates;
  color: string;
  map_id: string;
  user_id: string;
}

export interface FileEntity {
  id: string;
  url: string;
  type: string;
  extension: string;
  size: number;
  width?: number;
  height?: number;
}
