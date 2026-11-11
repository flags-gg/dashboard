"use client";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
export function useStaff() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ["staff", userId], enabled: !!userId, staleTime: 60_000, retry: false,
    queryFn: async () => {
      const response = await fetch("/api/staff/me", { cache: "no-store" });
      if (!response.ok) return false;
      return (await response.json() as { staff: boolean }).staff === true;
    },
  }).data === true;
}
