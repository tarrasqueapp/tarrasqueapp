import { REALTIME_LISTEN_TYPES, RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { createBrowserClient } from '@/utils/supabase/client';

interface Dto {
  channelName: string;
  table: string;
  filter?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => void;
}

/**
 * Subscribe to a table in the database and update the query cache when changes are made
 * @param channelName - The name of the channel to subscribe to
 * @param table - The table to subscribe to
 * @param filter - The filter to apply to the subscription
 * @param onChange - The function to call when the table changes
 */
export async function useSupabaseSubscription({ channelName, table, filter, onChange }: Dto) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [supabase] = useState(createBrowserClient());

  useEffect(() => {
    const c = supabase
      .channel(channelName)
      .on(REALTIME_LISTEN_TYPES.POSTGRES_CHANGES, { event: '*', schema: 'public', table, filter }, onChange)
      .subscribe();

    setChannel(c);

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, []);
}
