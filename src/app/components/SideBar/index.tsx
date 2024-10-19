"use client"

import Link from "next/link";
import {
  Building2,
  Container,
  Home,
  SquareGanttChart,
  SquareKanban,
  SquareMenu,
  VenetianMask
} from "lucide-react";
import {useAtom} from "jotai";
import {projectAtom, agentAtom, environmentAtom, secretMenuAtom} from "~/lib/statemanager";
import { useFlags } from "@flags-gg/react-library";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "~/components/ui/sidebar";

export default function SideBar() {
  const [selectedProject] = useAtom(projectAtom);
  const [selectedAgent] = useAtom(agentAtom);
  const [selectedEnvironment] = useAtom(environmentAtom);
  const [selectedMenu] = useAtom(secretMenuAtom);
  const {is} = useFlags();

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
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
        {is("show company")?.enabled() && (
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
        )}
        <SidebarMenu>
          <SidebarMenuItem key={"projects"}>
            <SidebarMenuButton asChild>
              <Link href={"/projects"}>
                <SquareGanttChart className={"h-5 w-5"} />
                <span>Projects</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {selectedProject.project_id && (
            <SidebarMenuItem key={`project-${selectedProject.project_id}`}>
              <SidebarMenuButton asChild>
                <Link href={`/project/${selectedProject.project_id}`}>
                  <SquareKanban className={"h-5 w-5"} />
                  <span>{selectedProject.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {selectedAgent.agent_id && (
            <SidebarMenuItem key={`agent-${selectedAgent.agent_id}`}>
              <SidebarMenuButton asChild>
                <Link href={`/agent/${selectedAgent.agent_id}`}>
                  <VenetianMask className={"h-5 w-5"} />
                  <span>{selectedAgent.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {selectedEnvironment.environment_id && (
            <SidebarMenuItem key={`environment-${selectedEnvironment.environment_id}`}>
              <SidebarMenuButton asChild>
                <Link href={`/environment/${selectedEnvironment.environment_id}`}>
                  <Container className={"h-5 w-5"} />
                  <span>{selectedEnvironment.name}</span>
                </Link>
              </SidebarMenuButton>
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
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

