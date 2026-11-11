"use client"

import { useFlags } from "@flags-gg/react-library";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useRouter } from "next/navigation";
import { useStaff } from "~/hooks/use-staff";
import { Building2, Shield } from "lucide-react";

export function UserNav() {
  const [hasCompletedOnboarding] = useAtom(hasCompletedOnboardingAtom);
  const {is} = useFlags();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter()
  const staff = useStaff();

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
            {staff && <UserButton.Action labelIcon={<Shield className="size-4" />} label="Admin panel" onClick={() => router.push("/staff")} />}
            {is("show company")?.enabled() && (
              hasCompletedOnboarding && <UserButton.Action labelIcon={<Building2 width={"1rem"} height={"1rem"} />} label={"Company"} onClick={() => router.push("/company")} />
            )}
          </UserButton.MenuItems>
        </UserButton>
      )}
    </div>
  )
}
