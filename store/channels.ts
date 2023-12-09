import { RealtimeChannel } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

import { getUser } from '@/actions/auth';
import { createBrowserClient } from '@/utils/supabase/client';

interface ChannelStore {
  channel: RealtimeChannel | null;
  joinChannel: (name: string) => Promise<RealtimeChannel>;
  send: <T>(event: string, payload: T) => void;
}

export const useChannelStore = create<ChannelStore>((set, get) => ({
  channel: null,

  /**
   * Join a channel
   * @param name - The channel name
   * @returns The channel
   */
  joinChannel: async (name) => {
    // Connect to Supabase
    const supabase = createBrowserClient();

    // Create the channel
    const channel = supabase.channel(name);

    // Subscribe to the channel
    channel.subscribe(async () => {
      let userId = '';

      // Get the user ID
      const user = await getUser();
      if (user) {
        userId = user.id;
      } else {
        // const cookieStore = cookies();
        // cookieStore.set('userId', uuidv4());
        // userId = cookieStore.get('userId')!.value;
      }

      // Track the user
      channel.track({ userId });
    });

    // Set the channel
    set(() => ({ channel }));

    // Return the channel
    return channel;
  },

  /**
   * Send an event to the channel
   * @param event - The event name
   * @param payload - The event payload
   */
  send: (event, payload) => {
    const { channel } = get();
    if (!channel) return;
    channel.send({ type: 'broadcast', event, payload });
  },
}));
