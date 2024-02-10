import { Map } from '@/actions/maps';
import { Profile } from '@/actions/profiles';

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

export interface TokenEntity {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  // DateTime
  created_at: string;
  updated_at: string;
  // User
  user: Profile;
  user_id: string;
  // Map
  map: Map;
  map_id: string;
  // Character
  // character?: CharacterEntity;
  character_id?: string;
}

export interface PluginEntity {
  id: string;
  manifest_url: string;
  created_at: string;
  user?: Profile;
  user_id: string;
}

export interface SubmittedPluginEntity {
  id: string;
  name: string;
  manifest_url: string;
}

export interface CampaignPluginEntity {
  id: string;
  campaign_id: string;
  plugin_id: string;
  plugin: PluginEntity | null;
}

export interface ManifestEntity {
  id: string;
  name: string;
  description: string;
  author: string;
  homepage_url: string;
  plugin_url: string;
  icon: string;
  iframe: {
    width: number;
    height: number;
  };
}
