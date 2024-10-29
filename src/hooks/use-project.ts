import { commitHashAtom, type IProject } from "~/lib/statemanager";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

const fetchProject = async (projectId: string): Promise<IProject | null> => {
  const res = await fetch(`/api/project?projectId=${projectId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch project')
  }
  const data = await res.json() as IProject;
  return data ?? null;
}

export const useProject = (projectId: string) => {
  const [commitHash] = useAtom(commitHashAtom)

  return useQuery<IProject | null, Error>({
    queryKey: ['project', projectId, commitHash],
    queryFn: () => fetchProject(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(projectId),
    retry: (failureCount, error) => {
      if (error.message.includes('404')) {
        return false;
      }
      return failureCount < 3;
    }
  });
}