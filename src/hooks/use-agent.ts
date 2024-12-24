import { commitHashAtom } from "~/lib/statemanager";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { FlagAgent } from "~/lib/interfaces";

const fetchAgent = async (agentId: string): Promise<FlagAgent | null> => {
  const res = await fetch(`/api/agent?agentId=${agentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch agent')
  }
  const data = await res.json() as FlagAgent
  return data ?? null;
}

export const useAgent = (agentId: string) => {
  const [commitHash] = useAtom(commitHashAtom)

  return useQuery<FlagAgent | null, Error>({
    queryKey: ['agent', agentId, commitHash],
    queryFn: () => fetchAgent(agentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(agentId),
    retry: (failureCount, error) => {
      if (error.message.includes('404')) {
        return false;
      }
      return failureCount < 3;
    }
  });
}