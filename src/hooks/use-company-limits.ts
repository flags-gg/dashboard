import { useQuery } from '@tanstack/react-query';
import { commitHashAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { CompanyLimits } from "~/lib/interfaces";
import { useUser } from "@clerk/nextjs";
import { logError } from "~/lib/logger";

const fetchCompanyLimits = async (signal?: AbortSignal): Promise<CompanyLimits> => {
  const res = await fetch(`/api/company/limits`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!res.ok) {
    logError('Failed to fetch company limits', res.status, res.statusText);
    throw new Error('Failed to fetch company limits');
  }

  return await res.json() as CompanyLimits;
};

export const useCompanyLimits = () => {
  const [commitHash] = useAtom(commitHashAtom)
  const { user, isLoaded } = useUser();

  return useQuery<CompanyLimits, Error>({
    queryKey: ['companyLimits', user?.id, commitHash],
    queryFn: ({ signal }) => fetchCompanyLimits(signal),
    enabled: isLoaded && !!user?.id,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};