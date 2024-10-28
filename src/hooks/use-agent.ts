import { type FlagAgent } from "~/lib/statemanager";
import { useQuery } from "@tanstack/react-query";

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
  return useQuery<FlagAgent | null, Error>({
    queryKey: ['agent', agentId],
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