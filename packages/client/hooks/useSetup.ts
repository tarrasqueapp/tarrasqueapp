import { useRouter } from 'next/router';
import useSWR from 'swr';

import { fetcher } from '../lib/fetcher';
import { SetupInterface } from '../store/setup';

export function useSetup() {
  const router = useRouter();
  const { data, error } = useSWR<SetupInterface>(`${router.basePath}/api/setup`, fetcher);

  return { data, error, isLoading: !data && !error };
}
