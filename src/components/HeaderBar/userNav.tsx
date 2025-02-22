"use client"

import { useFlags } from "@flags-gg/react-library";
import { useAtom } from "jotai";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

export function UserNav() {
  const [hasCompletedOnboarding] = useAtom(hasCompletedOnboardingAtom);
  const {is} = useFlags();
  const router = useRouter()

  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            {is("show company")?.enabled() && (
              hasCompletedOnboarding && <UserButton.Action labelIcon={<Building2 width={"1rem"} height={"1rem"} />} label={"Company"} onClick={() => router.push("/company")} />
            )}
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
    </div>
  )
}
