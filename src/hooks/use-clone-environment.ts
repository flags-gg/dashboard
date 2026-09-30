import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IEnvironment } from '~/lib/interfaces';

export type CloneEnvironmentInput = {
  agentId: string;
  environmentId: string;
  name: string;
};

async function cloneEnvironment(input: CloneEnvironmentInput): Promise<Pick<IEnvironment, 'environment_id'>> {
  const res = await fetch(`/api/environment/clone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null) as { error?: string } | null;
    throw new Error(data?.error || 'Failed to create child environment');
  }

  return await res.json() as Pick<IEnvironment, 'environment_id'>;
}

export function useCloneEnvironment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CloneEnvironmentInput) => cloneEnvironment(input),
    onSuccess: (data) => {
      // Best-effort invalidations; keys may differ across the app
      // Invalidate any environment detail queries
      if (data?.environment_id) {
        queryClient.invalidateQueries({ queryKey: ['environment', data.environment_id] }).catch(() => {});
      }
      // Invalidate any generic environment lists if present
      queryClient.invalidateQueries({ queryKey: ['environments'] }).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ['sidebar-project-tree'] }).catch(() => {});
    },
  });
}
