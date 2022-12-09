import { CampaignInterface } from '../../lib/types';

export class CampaignFactory implements Partial<CampaignInterface> {
  name = '';

  /**
   * Generate new campaign
   * @param campaign - The campaign to generate
   */
  constructor(campaign?: Partial<CampaignInterface>) {
    Object.assign(this, campaign);
  }
}
