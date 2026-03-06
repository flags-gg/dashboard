"use client"

import Onboarding from "./onboarding";
import Standard from "./standard";
import Unknown from "./unknown";
import { useUser } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getUserDetails } from "~/hooks/use-user-details";

export default function SideBar() {
  const {user} = useUser();

  const [isOnboarded, setIsOnboarded] = useAtom(hasCompletedOnboardingAtom);
  const {data: onboardedData, error: onboardedError} = useQuery({
    queryKey: ["onboarded", user?.id],
    queryFn: getUserDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(user) && Boolean(user?.id),
  });

  useEffect(() => {
    if (onboardedError) {
      window.location.href = "/";
    }
  }, [onboardedError]);

  useEffect(() => {
    if (onboardedData?.onboarded && !isOnboarded) {
      setIsOnboarded(true);
    }
  }, [onboardedData?.onboarded, isOnboarded, setIsOnboarded]);

  if (onboardedData?.onboarded || isOnboarded) {
    return <Standard />;
  }

  if (user) {
    return <Onboarding />
  }

  return <Unknown />
}

