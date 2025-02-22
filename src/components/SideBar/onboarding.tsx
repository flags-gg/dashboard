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
import { HousePlus, Home, Book } from "lucide-react";
import { useFlags } from "@flags-gg/react-library";
import { useUser } from "@clerk/nextjs";

export default function Onboarding() {
  const {is} = useFlags();
  const {user} = useUser();

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
        {is("docs")?.enabled() && (
          <SidebarGroup>
            <SidebarGroupLabel>Docs</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key={"docs"}>
                  <SidebarMenuButton asChild>
                    <a href={"https://docs.flags.gg"} target={"_blank"} rel={"noreferrer"}>
                      <Book className={"h-5 w-5"} />
                      <span>Docs</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {user && (
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
        )}
      </SidebarContent>
    </Sidebar>
  );
}