"use client"

import { useFlags } from "@flags-gg/react-library";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

export function UserNav() {
  const [hasCompletedOnboarding] = useAtom(hasCompletedOnboardingAtom);
  const {is} = useFlags();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter()

  if (!isLoaded) {
    return null;
  }

  return (
    <div>
      {!isSignedIn && (
        <SignInButton />
      )}
      {isSignedIn && (
        <UserButton>
          <UserButton.MenuItems>
            {is("show company")?.enabled() && (
              hasCompletedOnboarding && <UserButton.Action labelIcon={<Building2 width={"1rem"} height={"1rem"} />} label={"Company"} onClick={() => router.push("/company")} />
            )}
          </UserButton.MenuItems>
        </UserButton>
      )}
    </div>
  )
}
