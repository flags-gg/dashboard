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
  onboarded: boolean;
  created: boolean;
  subject: string;
}
export async function getUserDetails(): Promise<UserDetails> {
  try {
    const res = await fetch(`/api/user/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      new Error(`Failed to fetch user details: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as UserDetails;

    if (!data) {
      console.error("API returned no user details");
      new Error("No user details returned");
    }

    return data;
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error; // Re-throw the error so useQuery can handle it
  }
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