import { useAtom } from "jotai";
import { commitHashAtom, ICompanyInfo } from "~/lib/statemanager";
import { useQuery } from "@tanstack/react-query";

const fetchCompanyDetails = async (): Promise<ICompanyInfo> => {
  const res = await fetch(`/api/company/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch company details', res.status, res.statusText);
    throw new Error('Failed to fetch company details');
  }

  return await res.json() as ICompanyInfo;
};

export const useCompanyDetails = () => {
  const [commitHash] = useAtom(commitHashAtom)

  return useQuery<ICompanyInfo, Error>({
    queryKey: ['companyDetails', commitHash],
    queryFn: () => fetchCompanyDetails(),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};