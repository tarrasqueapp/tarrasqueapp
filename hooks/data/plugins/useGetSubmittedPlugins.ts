import { useQuery } from '@tanstack/react-query';

/**
 * Get submitted plugins from the GitHub repository
 * @returns The submitted plugins
 */
async function getSubmittedPlugins() {
  const response = await fetch('https://raw.githubusercontent.com/tarrasqueapp/plugins/main/plugins.json');
  const data = (await response.json()) as string[];
  return data;
}

/**
 * Get all submitted plugins
 * @returns Submitted plugins query
 */
export function useGetSubmittedPlugins() {
  return useQuery({
    queryKey: ['plugins'],
    queryFn: () => getSubmittedPlugins(),
  });
}
