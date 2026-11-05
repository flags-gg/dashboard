"use client"

import Onboarding from "./onboarding";
import Standard from "./standard";
import Unknown from "./unknown";
import { useUser } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useEffect } from "react";
import { useUserDetails } from "~/hooks/use-user-details";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function SideBar() {
  const {user} = useUser();

  const [, setIsOnboarded] = useAtom(hasCompletedOnboardingAtom);
  const {data: onboardedData, error: onboardedError, refetch, isFetching} = useUserDetails(user?.id ?? "");

  useEffect(() => {
    if (onboardedData) {
      setIsOnboarded(Boolean(onboardedData.onboarded));
    } else if (!user) {
      setIsOnboarded(false);
    }
  }, [onboardedData, user, setIsOnboarded]);

  if (!user) return <Unknown />;

  if (onboardedError || !onboardedData) {
    return (
      <Sidebar>
        <SidebarHeader>
          <Link href="/"><Image src="/logo512.png" alt="Flags.gg" width={250} height={250} className="size-25 ml-15" /></Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="gap-3 p-4">
            {onboardedError ? (
              <>
                <p role="alert" className="text-sm text-muted-foreground">Unable to load your account. Please try again.</p>
                <Button type="button" variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()}>Try again</Button>
                <Link href="/support" className="text-sm underline underline-offset-4">Contact support</Link>
              </>
            ) : <p role="status" className="text-sm text-muted-foreground">Loading your account…</p>}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  if (onboardedData.onboarded) {
    return <Standard />;
  }

  return <Onboarding />;
}
