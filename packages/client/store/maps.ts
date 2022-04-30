import axios from 'axios';
import { makeAutoObservable } from 'mobx';

import { CampaignInterface, MapInterface, MediaInterface, UserInterface } from '../lib/types';

export class MapEntity implements MapInterface {
  id = '';
  name = '';
  // DateTime
  createdAt = '';
  updatedAt = '';
  // Media
  media = null as unknown as MediaInterface;
  mediaId = '';
  // Campaign
  campaign = null as unknown as CampaignInterface;
  campaignId = '';
  // Created by
  createdBy = null as unknown as UserInterface;
  createdById = '';

  constructor(props: MapInterface) {
    Object.assign(this, props);
    makeAutoObservable(this);
  }
}

class MapStore {
  entities: MapEntity[] = [];
  currentMap: MapEntity | null = null;
  contextMenuVisible = false;
  contextMenuAnchorPoint = { x: 0, y: 0 };

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentMap(map: MapEntity | null) {
    this.currentMap = map;
  }

  setContextMenuVisible(contextMenuVisible: boolean) {
    this.contextMenuVisible = contextMenuVisible;
  }

  setContextMenuAnchorPoint(x: number, y: number) {
    this.contextMenuAnchorPoint.x = x;
    this.contextMenuAnchorPoint.y = y;
  }

  async getMaps() {
    const response = await axios.get<MapInterface[]>('/api/maps');
    this.entities = response.data.map((map) => new MapEntity(map));
    return this.entities;
  }

  async getMap(id: string) {
    const response = await axios.get<MapInterface>(`/api/maps/${id}`);
    const entity = new MapEntity(response.data);
    this.entities.push(entity);
    return entity;
  }
}

export const mapStore = new MapStore();
