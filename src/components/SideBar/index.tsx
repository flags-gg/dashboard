"use client"

import Onboarding from "./onboarding";
import Standard from "./standard";
import Unknown from "./unknown";
import { useUser } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "~/hooks/use-toast";
import { useEffect } from "react";
import { getUserDetails } from "~/hooks/use-user-details";

export default function SideBar() {
  const {user} = useUser();
  const {toast} = useToast();

  console.info("user", user)

  const [, setIsOnboarded] = useAtom(hasCompletedOnboardingAtom);
  const {data: onboardedData, error: onboardedError} = useQuery({
    queryKey: ["onboarded", user?.id],
    queryFn: getUserDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(user) && Boolean(user?.id),
  });

  useEffect(() => {
    if (onboardedError) {
      toast({
        title: "Error loading onboarded status",
        description: "Please try again later.",
      });
    }
  }, [onboardedError, toast]);

  if (onboardedData?.onboarded) {
    setIsOnboarded(true);
    return <Standard />;
  }

  if (user) {
    return <Onboarding />
  }

  return <Unknown />
}

