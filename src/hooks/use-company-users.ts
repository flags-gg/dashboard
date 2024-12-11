import { UserDetails } from "~/hooks/use-user-details";
import { useQuery } from "@tanstack/react-query";

const fetchCompanyUsers = async (): Promise<UserDetails[]> => {
  const res = await fetch(`/api/company/user/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch company users: ${res.status} ${res.statusText}`);
  }

  const data = await res.json() as UserDetails[];
  if (data.length === 0) {
    throw new Error("No users found");
  }

  return data;
};

export function useCompanyUsers() {
  return useQuery({
    queryKey: ["companyUsers"],
    queryFn: fetchCompanyUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.message.includes('404')) {
        return false;
      }
      return failureCount < 3;
    }
  });
}