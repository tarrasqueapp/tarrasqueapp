import { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { useChannelStore } from '@/store/channel';

/**
 * Join a map channel and track the user's presence
 * @param mapId - The map ID
 * @returns The channel
 */
export function useJoinMapChannel(mapId?: string) {
  const joinChannel = useChannelStore((state) => state.joinChannel);

  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // If the map ID is not provided, do nothing
    if (!mapId) return;

    // Join the channel
    const channel = joinChannel(`map_${mapId}`);
    setChannel(channel);

    // Unsubscribe from the channel when the component is unmounted
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { channel };
}
