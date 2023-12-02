import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { PluginEntity } from '@tarrasque/common';

import { api } from '../../../../lib/api';

/**
 * Send a request to delete a plugin from a campaign
 * @param plugin - The plugin to delete
 * @returns The deleted plugin
 */
async function uninstallPlugin(plugin: PluginEntity) {
  const { data } = await api.delete<PluginEntity>(`/api/campaigns/${plugin.campaignId}/plugins/${plugin.id}`);
  return data;
}

/**
 * Delete a plugin from a campaign
 * @returns Delete campaign plugin mutation
 */
export function useUninstallPlugin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uninstallPlugin,
    // Optimistic update
    onMutate: async (plugin) => {
      const queryKey = ['campaigns', plugin.campaignId, 'plugins'];
      await queryClient.cancelQueries({ queryKey });
      const previousPlugins = queryClient.getQueryData<PluginEntity[]>(queryKey);
      queryClient.setQueryData(queryKey, (old: Partial<PluginEntity>[] = []) => old.filter((m) => m.id !== plugin.id));
      return { previousPlugins };
    },
    // Rollback
    onError: (err, plugin, context) => {
      queryClient.setQueryData(['campaigns', plugin.campaignId, 'plugins'], context?.previousPlugins);
    },
    // Refetch
    onSettled: (plugin, err: Error | null) => {
      if (err) {
        toast.error(err.message);
      }
      queryClient.invalidateQueries({ queryKey: ['campaigns', plugin?.campaignId, 'plugins'] });
    },
  });
}
