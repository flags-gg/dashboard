import { useQuery } from "@tanstack/react-query";

type UserDetails = {
  avatar: string;
  first_name: string;
  last_name: string;
  job_title: string;
  location: string;
  timezone: string;
}
async function getUserDetails(): Promise<UserDetails> {
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

  return await res.json() as UserDetails;
}

export function useUserDetails(userId: string) {
  return useQuery({
    queryKey: ["userDetails", userId],
    queryFn: getUserDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}