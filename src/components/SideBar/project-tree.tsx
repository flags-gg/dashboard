"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Container, FolderTree, SquareKanban, VenetianMask } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import type { FlagAgent, IEnvironment, IProject } from "~/lib/interfaces";
import { environmentAtom, secretMenuAtom } from "~/lib/statemanager";

type ProjectTreeData = {
  projects: IProject[];
  agents: FlagAgent[];
  environments: IEnvironment[];
};

async function getList<T>(path: string, key: string, signal?: AbortSignal): Promise<T[]> {
  const response = await fetch(path, { signal, cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  const data: unknown = await response.json();
  if (typeof data !== "object" || data === null || !(key in data)) {
    throw new Error(`Unexpected response from ${path}`);
  }
  const items: unknown = (data as Record<string, unknown>)[key];
  if (!Array.isArray(items)) throw new Error(`Unexpected response from ${path}`);
  return items as T[];
}

export async function loadProjectTree(signal?: AbortSignal): Promise<ProjectTreeData> {
  const [projects, agents, environments] = await Promise.all([
    getList<IProject>("/api/project/list", "projects", signal),
    getList<FlagAgent>("/api/agent/list", "agents", signal),
    getList<IEnvironment>("/api/environment/list", "environments", signal),
  ]);
  return { projects, agents, environments };
}

export function getProjectTreeContext(
  pathname: string,
  data: ProjectTreeData,
  selectedEnvironmentId?: string,
) {
  const [, kind, id] = pathname.split("/");
  const agentId = kind === "agent" ? id : kind === "environment"
    ? data.environments.find((environment) => environment.environment_id === id)?.agent_id
    : kind === "secretmenu"
      ? data.environments.find((environment) => environment.environment_id === selectedEnvironmentId)?.agent_id
      : undefined;
  const projectId = kind === "project" ? id
    : data.agents.find((agent) => agent.agent_id === agentId)?.project_info?.project_id;
  const project = data.projects.find((item) => item.project_id === projectId);
  if (!project) return null;

  const agents = data.agents
    .filter((agent) => agent.project_info?.project_id === project.project_id)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((agent) => ({
      ...agent,
      environments: data.environments
        .filter((environment) => environment.agent_id === agent.agent_id)
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)),
    }));

  return { project, agents };
}

export default function ProjectTree() {
  const pathname = usePathname();
  const selectedEnvironment = useAtomValue(environmentAtom);
  const selectedMenu = useAtomValue(secretMenuAtom);
  const isResourcePage = /^\/(project|agent|environment|secretmenu)\//.test(pathname);
  const { data, isPending, isError } = useQuery({
    queryKey: ["sidebar-project-tree"],
    queryFn: ({ signal }) => loadProjectTree(signal),
    enabled: isResourcePage,
    staleTime: 30_000,
  });

  if (!isResourcePage) return null;
  if (isPending) return <SidebarGroup><SidebarGroupLabel>Project Options</SidebarGroupLabel></SidebarGroup>;
  if (isError || !data) return null;

  const context = getProjectTreeContext(pathname, data, selectedEnvironment.environment_id);
  if (!context) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="gap-2">
        <FolderTree className="size-4" aria-hidden="true" />
        <span className="truncate" title={context.project.name}>{context.project.name}</span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === `/project/${context.project.project_id}`}>
              <Link href={`/project/${context.project.project_id}`}>
                <SquareKanban aria-hidden="true" />
                <span>Project overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {context.agents.map((agent) => (
            <SidebarMenuItem key={agent.agent_id}>
              <SidebarMenuButton asChild isActive={pathname === `/agent/${agent.agent_id}`}>
                <Link href={`/agent/${agent.agent_id}`} title={agent.name}>
                  <VenetianMask aria-hidden="true" />
                  <span className="truncate">{agent.name}</span>
                </Link>
              </SidebarMenuButton>
              {agent.environments.length > 0 && (
                <SidebarMenuSub>
                  {agent.environments.map((environment) => (
                    <Fragment key={environment.environment_id}>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === `/environment/${environment.environment_id}`}>
                          <Link href={`/environment/${environment.environment_id}`} title={environment.name}>
                            <Container aria-hidden="true" />
                            <span className="truncate">{environment.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {selectedMenu.menu_id && selectedEnvironment.environment_id === environment.environment_id && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === `/secretmenu/${selectedMenu.menu_id}`}>
                            <Link href={`/secretmenu/${selectedMenu.menu_id}`} className="pl-7">
                              <span>Secret menu</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </Fragment>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
