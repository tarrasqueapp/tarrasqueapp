import { useQuery } from '@tanstack/react-query';

export interface ManifestUrl {
  name: 'icon' | 'map_iframe' | 'compendium_iframe' | 'homepage';
  url: string;
  width?: number;
  height?: number;
}

interface Manifest {
  id: string;
  name: string;
  description: string;
  author: string;
  urls: ManifestUrl[];
}

/**
 * Send a request to get all available plugins
 * @returns The plugins
 */
export async function getPlugin(manifestUrl: string) {
  const response = await fetch(manifestUrl);
  const data = (await response.json()) as Manifest;
  return data;
}

/**
 * Get all available plugins
 * @returns Plugins query
 */
export function useGetPlugin(manifestUrl: string) {
  return useQuery({
    queryKey: ['plugins', manifestUrl],
    queryFn: () => getPlugin(manifestUrl),
    enabled: Boolean(manifestUrl),
  });
}
