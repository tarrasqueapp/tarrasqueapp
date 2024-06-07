import { Enums, Tables } from './types.gen';

export type Campaign = Tables<'campaigns'>;
export type Grid = Tables<'grids'>;
export type GridType = Enums<'grid_type'>;
export type CampaignInvite = Tables<'campaign_invites'> & { campaign: Campaign };
export type Map = Tables<'maps'> & { media: Media };
export type Media = Tables<'media'>;
export type CampaignMembership = Tables<'campaign_memberships'> & { user: Profile };
export type UserMembership = Tables<'campaign_memberships'> & { campaign: Campaign };
export type CampaignMemberRole = Enums<'campaign_member_role'>;
export type Plugin = Tables<'plugins'>;
export type CampaignPlugin = Tables<'campaign_plugins'> & { plugin: Plugin };
export type Profile = Tables<'profiles'> & { avatar: Media };
export type Setup = Tables<'setup'>;
export type SetupStep = Enums<'setup_step'>;
export type Token = Tables<'tokens'>;

export type ManifestUrl = {
  name: 'icon' | 'map_iframe' | 'compendium_iframe' | 'homepage';
  url: string;
  width?: number;
  height?: number;
};

export type Manifest = {
  id: string;
  name: string;
  description: string;
  author: string;
  urls: ManifestUrl[];
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Coordinates = {
  x: number;
  y: number;
};

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

export enum Tool {
  Select = 'select',
  Fog = 'fog',
  Draw = 'draw',
  Shape = 'shape',
  Measure = 'measure',
  Note = 'note',
}

export enum SelectTool {
  Single = 'single',
  Multi = 'multi',
}

export enum FogTool {
  Hide = 'hide',
  Show = 'show',
}

export enum DrawTool {
  Brush = 'brush',
  Eraser = 'eraser',
}

export enum ShapeTool {
  Circle = 'circle',
  Rectangle = 'rectangle',
  Triangle = 'triangle',
}
