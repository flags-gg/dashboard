import { useQuery } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import { type CompanyLimits } from '~/lib/statemanager';

const fetchCompanyLimits = async (session: Session): Promise<CompanyLimits> => {
  const res = await fetch(`/api/company/limits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.user.access_token}`,
    },
    body: JSON.stringify({
      sessionToken: session.user.access_token,
      userId: session.user.id,
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch company limits', res.status, res.statusText);
    throw new Error('Failed to fetch company limits');
  }

  return res.json();
};

export const useCompanyLimits = (session: Session) => {
  return useQuery<CompanyLimits, Error>({
    queryKey: ['companyLimits', session.user.id],
    queryFn: () => fetchCompanyLimits(session),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};