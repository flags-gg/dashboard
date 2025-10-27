import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IEnvironment } from '~/lib/interfaces';

export type CreateEnvironmentInput = {
  agentId: string;
  parentId: string;
  name: string;
};

async function createEnvironment(input: CreateEnvironmentInput): Promise<IEnvironment> {
  const res = await fetch(`/api/environment/create`, {
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

export function useCreateEnvironment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEnvironmentInput) => createEnvironment(input),
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
