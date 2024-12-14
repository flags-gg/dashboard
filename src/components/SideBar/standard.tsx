"use client"

import Link from "next/link";
import {
  Book,
  Building2,
  Container,
  Home,
  SquareGanttChart,
  SquareKanban,
  SquareMenu,
  VenetianMask
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
  SidebarHeader, SidebarMenuBadge, SidebarFooter
} from "~/components/ui/sidebar";
import { useAtom } from "jotai";
import {
  agentAtom,
  environmentAtom,
  hasCompletedOnboardingAtom,
  projectAtom,
  secretMenuAtom
} from "~/lib/statemanager";
import { useFlags } from "@flags-gg/react-library";

export default function Standard() {
  const [hasCompletedOnboarding] = useAtom(hasCompletedOnboardingAtom);
  const [selectedProject] = useAtom(projectAtom);
  const [selectedAgent] = useAtom(agentAtom);
  const [selectedEnvironment] = useAtom(environmentAtom);
  const [selectedMenu] = useAtom(secretMenuAtom);

  const {is} = useFlags();

  if (!hasCompletedOnboarding) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader />
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
        {is("show company")?.enabled() && (
          <SidebarGroup>
            <SidebarGroupLabel>Company</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key={"company"}>
                  <SidebarMenuButton asChild>
                    <Link href={"/company"}>
                      <Building2 className={"h-5 w-5"} />
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
                    <SquareGanttChart className={"h-5 w-5"} />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {selectedProject.project_id && (
          <SidebarGroup>
            <SidebarGroupLabel>Project Options</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key={`project-${selectedProject.project_id}`}>
                  <SidebarMenuButton asChild>
                    <Link href={`/project/${selectedProject.project_id}`}>
                      <SquareKanban className={"h-5 w-5"} />
                      <span>Project</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{selectedProject.name}</SidebarMenuBadge>
                </SidebarMenuItem>
                {selectedAgent.agent_id && (
                  <SidebarMenuItem key={`agent-${selectedAgent.agent_id}`}>
                    <SidebarMenuButton asChild>
                      <Link href={`/agent/${selectedAgent.agent_id}`}>
                        <VenetianMask className={"h-5 w-5"} />
                        <span>Agent</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{selectedAgent.name}</SidebarMenuBadge>
                  </SidebarMenuItem>
                )}
                {selectedEnvironment.environment_id && (
                  <SidebarMenuItem key={`environment-${selectedEnvironment.environment_id}`}>
                    <SidebarMenuButton asChild>
                      <Link href={`/environment/${selectedEnvironment.environment_id}`}>
                        <Container className={"h-5 w-5"} />
                        <span>Environment</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{selectedEnvironment.name}</SidebarMenuBadge>
                  </SidebarMenuItem>
                )}
                {selectedMenu.menu_id && (
                  <SidebarMenuItem key={`secretmenu-${selectedMenu.menu_id}`}>
                    <SidebarMenuButton asChild>
                      <Link href={`/secretmenu/${selectedMenu.menu_id}`}>
                        <SquareMenu className={"h-5 w-5"} />
                        <span>Secret Menu Config</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}