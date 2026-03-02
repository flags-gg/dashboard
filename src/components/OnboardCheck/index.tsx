"use client"

import { useAtom } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useEffect } from "react";
import { getUserDetails } from "~/hooks/use-user-details";
import { useUser } from "@clerk/nextjs";

export default function OnboardCheck() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useAtom(hasCompletedOnboardingAtom);
  const {user: useUserData} = useUser();

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      getUserDetails().then((user) => {
        if (user?.onboarded) {
          setHasCompletedOnboarding(true)
        }
      }).catch((e) => {
        console.error("error in getUserDetails", e, useUserData)
      })
    }
  }, [hasCompletedOnboarding, setHasCompletedOnboarding, useUserData])

  return <></>
}