import { commitHashAtom } from "~/lib/statemanager";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { IEnvironment } from "~/lib/interfaces";

const fetchEnvironment = async (environmentId: string): Promise<IEnvironment | null> => {
  const res = await fetch(`/api/environment?environmentId=${environmentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch environment')
  }
  const data = await res.json() as IEnvironment
  return data ?? null;
}

export const useEnvironment = (environmentId: string) => {
  const [commitHash] = useAtom(commitHashAtom)

  return useQuery<IEnvironment | null, Error>({
    queryKey: ['environment', environmentId, commitHash],
    queryFn: () => fetchEnvironment(environmentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(environmentId),
    retry: (failureCount, error) => {
      if (error.message.includes('404')) {
        return false;
      }
      return failureCount < 3;
    }
  });
}