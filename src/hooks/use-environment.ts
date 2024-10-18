import { type IEnvironment } from "~/lib/statemanager";
import { useQuery } from "@tanstack/react-query";

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

export const useEnvironment = (environmentId: string) => {
  return useQuery<IEnvironment | null, Error>({
    queryKey: ['environment', environmentId],
    queryFn: () => fetchEnvironment(environmentId),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}