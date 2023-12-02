import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { PluginEntity } from '@tarrasque/common';

import { api } from '../../../../lib/api';

interface InstallPluginDto {
  campaignId: string;
  manifestUrl: string;
}

/**
 * Send a request to add a plugin to a campaign
 * @param campaignId - The campaign to add a plugin to
 * @param manifestUrl - The manifest URL of the plugin to add
 * @returns The updated campaign
 */
async function installPlugin(dto: InstallPluginDto) {
  const { data } = await api.post<PluginEntity>(`/api/campaigns/${dto.campaignId}/plugins`, {
    manifestUrl: dto.manifestUrl,
  });
  return data;
}

/**
 * Add a plugin to a campaign
 * @returns Campaign plugin mutation
 */
export function useInstallPlugin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: installPlugin,
    onSettled: (plugin, err: Error | null) => {
      if (err) {
        toast.error(err.message);
      }
      queryClient.invalidateQueries({ queryKey: ['campaigns', plugin?.campaignId, 'plugins'] });
    },
  });
}
