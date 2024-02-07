import { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { useChannelStore } from '@/store/channel';

/**
 * Check if a user is online in a channel by looking at the presence state
 * @param channel - The channel
 * @param userId - The user ID
 * @returns Whether the user is online
 */
function isUserOnline(channel: RealtimeChannel, userId: string) {
  const presenceState = channel.presenceState();
  const users = Object.keys(presenceState)
    .map((presenceId) => {
      const presences = presenceState[presenceId] as unknown as { user_id: string }[];
      return presences.map((presence) => presence.user_id);
    })
    .flat();

  return users.includes(userId);
}

/**
 * Join a user channel and track the user's presence
 * @param userId - The user ID
 * @returns The channel and whether the user is online
 */
export function useJoinUserChannel(userId?: string) {
  const joinChannel = useChannelStore((state) => state.joinChannel);

  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isOnline, setOnline] = useState(false);

  useEffect(() => {
    // If the user ID is not provided, do nothing
    if (!userId) return;

    // Join the channel
    const channel = joinChannel(`user_${userId}`);
    setChannel(channel);

    const online = isUserOnline(channel, userId);
    setOnline(online);

    channel.on('presence', { event: 'sync' }, () => {
      const online = isUserOnline(channel, userId);
      setOnline(online);
    });

    // Unsubscribe from the channel when the component is unmounted
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { channel, isOnline };
}
