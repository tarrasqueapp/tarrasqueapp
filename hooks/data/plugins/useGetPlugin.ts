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
 * Get all available plugins
 * @returns Plugins query
 */
export function useGetPlugin(manifestUrl: string) {
  return useQuery({
    queryKey: ['plugins', manifestUrl],
    queryFn: async () => {
      const response = await fetch(manifestUrl);
      const data = (await response.json()) as Manifest;
      return data;
    },
    enabled: Boolean(manifestUrl),
  });
}
