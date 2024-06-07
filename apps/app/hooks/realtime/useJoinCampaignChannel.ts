import { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { useChannelStore } from '@/store/useChannelStore';

/**
 * Join a campaign channel and track the user's presence
 * @param campaignId - The campaign ID
 * @returns The channel
 */
export function useJoinCampaignChannel(campaignId?: string) {
  const joinChannel = useChannelStore((state) => state.joinChannel);

  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // If the campaign ID is not provided, do nothing
    if (!campaignId) return;

    // Join the channel
    const channel = joinChannel(`campaign_${campaignId}`);
    setChannel(channel);

    // Unsubscribe from the channel when the component is unmounted
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { channel };
}
