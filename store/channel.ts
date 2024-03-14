import { RealtimeChannel } from '@supabase/supabase-js';
import { setCookie } from 'cookies-next';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

import { getUser } from '@/actions/auth';
import { createBrowserClient } from '@/utils/supabase/client';

interface ChannelStore {
  channels: Record<string, RealtimeChannel>;
  joinChannel: (name: string) => RealtimeChannel;
}

export const useChannelStore = create<ChannelStore>((set, get) => ({
  channels: {},

  /**
   * Join a channel
   * @param name - The channel name
   * @returns The channel
   */
  joinChannel: (name) => {
    // Connect to Supabase
    const supabase = createBrowserClient();

    // Check if the channel already exists and return it
    const existingChannel = get().channels[name];
    if (existingChannel) {
      return existingChannel;
    }

    // Create the channel
    const channel = supabase.channel(name);

    // Subscribe to the channel
    channel.subscribe(async () => {
      let user_id = '';

      // Get the user ID
      const { data: user } = await getUser();
      if (user) {
        user_id = user.id;
      } else {
        const id = uuidv4();
        setCookie('user_id', uuidv4());
        user_id = id;
      }

      // Track the user
      channel.track({ user_id });
    });

    // Set the channel
    set(() => ({ channels: { ...get().channels, [name]: channel } }));

    // Return the channel
    return channel;
  },
}));
