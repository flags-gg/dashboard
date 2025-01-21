"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/components/ui/sidebar";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import Link from "next/link";
import { HousePlus, Home } from "lucide-react";

export default function Onboarding() {
  const [hasCompletedOnboarding] = useAtom(hasCompletedOnboardingAtom);

  if (hasCompletedOnboarding) {
    return null
  }

  return(
    <Sidebar>
      <SidebarHeader>
        Flags.gg
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"dashboard"}>
                <SidebarMenuButton asChild>
                  <Link href={"/"}>
                    <Home className={"h-5 w-5"} />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Onboarding</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"onboarding"}>
                <SidebarMenuButton asChild>
                  <Link href={"/onboarding"}>
                    <HousePlus className={"h-5 w-5"} />
                    <span>OnBoard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}