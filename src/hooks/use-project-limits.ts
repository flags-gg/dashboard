import { commitHashAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { type AgentLimits } from "~/lib/interfaces";

const fetchProjectLimits = async (projectId: string): Promise<AgentLimits> => {
  const res = await fetch(`/api/project/limits/?project_id=${projectId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.info('Failed to fetch project limits', res.status, res.statusText, projectId);
    throw new Error('Failed to fetch project limits');
  }

  return await res.json() as AgentLimits;
};

export const useProjectLimits = (projectId: string) => {
  const [commitHash] = useAtom(commitHashAtom)

  return useQuery<AgentLimits, Error>({
    queryKey: ['projectLimits', projectId, commitHash],
    queryFn: () => fetchProjectLimits(projectId),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!projectId,
  });
};