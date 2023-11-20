import { useQuery } from '@tanstack/react-query';

import { TarrasquePlugin, tarrasque } from '@tarrasque/sdk';

import { loadPlugin } from '../lib/loadPlugin';

async function getPlugins(urls: string[]): Promise<TarrasquePlugin[]> {
  return Promise.all(
    urls.map(async (url) => {
      const module = await loadPlugin(url);
      const Plugin = module.default;
      return new Plugin();
    }),
  );
}

export function usePlugins(urls: string[]) {
  const plugins = useQuery({
    queryKey: ['plugins'],
    queryFn: () => getPlugins(urls),
    enabled: Boolean(tarrasque && urls?.length),
  });

  return plugins;
}
