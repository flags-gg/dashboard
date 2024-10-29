import { useQuery } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import { commitHashAtom, type CompanyLimits } from "~/lib/statemanager";
import { useAtom } from "jotai";

const fetchCompanyLimits = async (): Promise<CompanyLimits> => {
  const res = await fetch(`/api/company/limits`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch company limits', res.status, res.statusText);
    throw new Error('Failed to fetch company limits');
  }

  return await res.json() as CompanyLimits;
};

export const useCompanyLimits = (session: Session) => {
  const [commitHash] = useAtom(commitHashAtom)

  return useQuery<CompanyLimits, Error>({
    queryKey: ['companyLimits', session.user.id, commitHash],
    queryFn: () => fetchCompanyLimits(),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};