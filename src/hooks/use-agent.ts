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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

export const useAgent = (agentId: string) => {
  return useQuery<FlagAgent | null, Error>({
    queryKey: ['agent', agentId],
    queryFn: () => fetchAgent(agentId),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}