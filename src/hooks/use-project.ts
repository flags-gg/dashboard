import { IProject } from "~/lib/statemanager";
import { useQuery } from "@tanstack/react-query";

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

export const useProject = (projectId: string) => {
  return useQuery<IProject | null, Error>({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}