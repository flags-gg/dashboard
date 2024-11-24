import { useQuery } from "@tanstack/react-query";
import { commitHashAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";

type UserGroup = {
  id: string;
  name: string;
}

export type UserDetails = {
  known_as: string;
  avatar: string;
  first_name: string;
  last_name: string;
  job_title: string;
  location: string;
  timezone: string;
  group: UserGroup;
  company_invite_code: string;
}
async function getUserDetails(): Promise<UserDetails | null> {
  const res = await fetch(`/api/user/details`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user details");
  }

  const data = await res.json() as UserDetails;
  return data ?? null;
}

export function useUserDetails(userId: string) {
  const [commitHash] = useAtom(commitHashAtom)

  return useQuery({
    queryKey: ["userDetails", userId, commitHash],
    queryFn: getUserDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(userId),
    retry: (failureCount, error) => {
      if (error.message.includes('404')) {
        return false;
      }
      return failureCount < 3;
    }
  });
}