"use client"

import Link from "next/link";
import {
  Book,
  Building2,
  Home,
  SquareGanttChart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader, SidebarFooter
} from "~/components/ui/sidebar";
import { useAtomValue } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { useFlags } from "@flags-gg/react-library";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import ProjectTree from "./project-tree";

export default function Standard() {
  const {is} = useFlags();
  const {user} = useUser();

  const hasCompletedOnboarding = useAtomValue(hasCompletedOnboardingAtom);

  if (!hasCompletedOnboarding || !user) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={"/"}>
          <Image src={"/logo512.png"} alt={"Flags.gg"} width={250} height={250} className={"size-25 cursor-pointer ml-15"} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"dashboard"}>
                <SidebarMenuButton asChild>
                  <Link href={"/"}>
                    <Home className={"size-5"} />
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
                      <Book className={"size-5"} />
                      <span>Docs</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {is("show company")?.enabled() && (
          <SidebarGroup>
            <SidebarGroupLabel>Company</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key={"company"}>
                  <SidebarMenuButton asChild>
                    <Link href={"/company"}>
                      <Building2 className={"size-5"} />
                      <span>Company</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"projects"}>
                <SidebarMenuButton asChild>
                  <Link href={"/projects"}>
                    <SquareGanttChart className={"size-5"} />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <ProjectTree />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
