"use client"

import { useAtom } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useEffect } from "react";
import {hasCookie} from "cookies-next";
import { getUserDetails } from "~/hooks/use-user-details";

export default function OnboardCheck() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useAtom(hasCompletedOnboardingAtom);

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      if (hasCookie("hasCompletedOnboarding")) {
        setHasCompletedOnboarding(true)
        console.info("cookie onboarded")
        return
      }

      getUserDetails().then((user) => {
        if (user?.onboarded) {
          setHasCompletedOnboarding(true)
          console.info("details onboarded")
        }
      }).catch((e) => {
        console.info("error in getUserDetails", e)
      })
    }
  }, [hasCompletedOnboarding])

  return <></>
}