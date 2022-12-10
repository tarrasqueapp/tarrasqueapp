import { FileInterface, MapInterface } from '../types';

export class MapFactory implements Partial<MapInterface> {
  name = '';
  file = null as unknown as FileInterface;

  /**
   * Generate new map
   * @param map - The map to generate
   */
  constructor(map?: Partial<MapInterface>) {
    Object.assign(this, map);
  }
}
