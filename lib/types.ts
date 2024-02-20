export interface Dimensions {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface PingLocationEntity {
  id?: string;
  position: Position;
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
