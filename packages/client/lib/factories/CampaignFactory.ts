import { CampaignInterface } from '../../lib/types';

export class CampaignFactory implements Partial<CampaignInterface> {
  name = '';

  /**
   * Generate new campaign
   * @param campaign
   */
  constructor(campaign?: Partial<CampaignInterface>) {
    Object.assign(this, campaign);
  }
}
