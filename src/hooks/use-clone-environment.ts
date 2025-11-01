import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IEnvironment } from '~/lib/interfaces';

export type CloneEnvironmentInput = {
  agentId: string;
  environmentId: string;
  name: string;
};

async function cloneEnvironment(input: CloneEnvironmentInput): Promise<IEnvironment> {
  const res = await fetch(`/api/environment/clone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to create environment');
  }

  return await res.json() as IEnvironment;
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
    },
  });
}
