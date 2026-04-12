"use client"

import Onboarding from "./onboarding";
import Standard from "./standard";
import Unknown from "./unknown";
import { useUser } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useEffect } from "react";
import { useUserDetails } from "~/hooks/use-user-details";

export default function SideBar() {
  const {user} = useUser();

  const [isOnboarded, setIsOnboarded] = useAtom(hasCompletedOnboardingAtom);
  const {data: onboardedData, error: onboardedError} = useUserDetails(user?.id ?? "");

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
