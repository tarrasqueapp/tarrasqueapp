import { MapInterface, MediaInterface } from '../types';

export class MapFactory implements Partial<MapInterface> {
  name = '';
  campaignId = '';
  media = [] as MediaInterface[];
  selectedMediaId = '';

  /**
   * Generate new map
   * @param map - The map to generate
   */
  constructor(map?: Partial<MapInterface>) {
    Object.assign(this, map);
  }
}
