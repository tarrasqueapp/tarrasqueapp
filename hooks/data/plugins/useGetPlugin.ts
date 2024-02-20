import { useQuery } from '@tanstack/react-query';

interface Manifest {
  name: string;
  description: string;
  author: string;
  icon_url: string;
  plugin_url: string;
  homepage_url: string;
  iframe: {
    width: number;
    height: number;
  };
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
