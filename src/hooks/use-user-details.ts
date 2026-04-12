import { useQuery } from "@tanstack/react-query";
import { commitHashAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { logError } from "~/lib/logger";

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
  onboarded: boolean;
  created: boolean;
  subject: string;
}
export async function getUserDetails(signal?: AbortSignal): Promise<UserDetails> {
  try {
    const res = await fetch(`/api/user/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal,
    });

    if (!res.ok) {
      logError("use-user-details api error", `${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch user details: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as UserDetails;

    if (!data) {
      logError("use-user-details api returned no user details");
      throw new Error("No user details returned");
    }

    return data;
  } catch (error) {
    logError("error in getUserDetails", error);
    throw error; // Re-throw the error so useQuery can handle it
  }
}


export function useUserDetails(userId: string) {
  const [commitHash] = useAtom(commitHashAtom)

  return useQuery({
    queryKey: ["userDetails", userId, commitHash],
    queryFn: ({ signal }) => getUserDetails(signal),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(userId),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
