import { MapEntity, MediaEntity } from '@tarrasque/common';

export class MapFactory implements Partial<MapEntity> {
  name = '';
  campaignId = '';
  media = [] as MediaEntity[];
  selectedMediaId = '';

  /**
   * Generate new map
   * @param map - The map to generate
   */
  constructor(map?: Partial<MapEntity>) {
    Object.assign(this, map);
  }
}
