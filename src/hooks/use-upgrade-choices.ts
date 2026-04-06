import { useAtom } from "jotai";
import { commitHashAtom } from "~/lib/statemanager";
import { useQuery } from "@tanstack/react-query";
import { UpgradeChoice } from "~/lib/interfaces";

interface UpgradeChoices {
  prices: UpgradeChoice[];
}

const fetchUpgradeChoices = async (signal?: AbortSignal): Promise<UpgradeChoices> => {
  const res = await fetch(`/api/company/pricing`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    signal,
  });

  if (!res.ok) {
    console.error('Failed to fetch company limits', res.status, res.statusText);
    throw new Error('Failed to fetch company limits');
  }

  return await res.json() as UpgradeChoices;
};

export const useUpgradeChoices = () => {
  const [commitHash] = useAtom(commitHashAtom)

  return useQuery<UpgradeChoices, Error>({
    queryKey: ['companyUpgradeChoices', commitHash],
    queryFn: ({ signal }) => fetchUpgradeChoices(signal),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};