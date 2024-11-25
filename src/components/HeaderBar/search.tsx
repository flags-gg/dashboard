"use client"

import { useFlags } from "@flags-gg/react-library";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput, CommandItem,
  CommandList,
  CommandSeparator
} from "~/components/ui/command";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  type AgentsData,
  companyInfoAtom,
  type EnvironmentsData,
  ICompanyInfo,
  type ProjectsData
} from "~/lib/statemanager";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "~/hooks/use-toast";
import { useAtom } from "jotai";
import { Session } from "next-auth";

async function getProjects() {
  const res = await fetch(`/api/project/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return await res.json() as ProjectsData;
}

async function getAgents() {
  const res = await fetch(`/api/agent/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch agents");
  }

  return await res.json() as AgentsData;
}

async function getEnvironments() {
  const res = await fetch(`/api/environment/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch environments");
  }

  return await res.json() as EnvironmentsData;
}

export function SearchBox({session}: {session: Session}) {
  const {toast} = useToast();
  const {is} = useFlags();
  const [isOpen, setIsOpen] = useState(false);
  const [companyInfo] = useAtom(companyInfoAtom);
  const user = session?.user;

  if (companyInfo?.company?.invite_code === "") {
    return <div className={"relative ml-auto flex-1 md:grow-0"}></div>;
  }

  if (!is("search")?.enabled()) {
    console.info("search disabled")
    return <div className={"relative ml-auto flex-1 md:grow-0"}></div>
  }

  const {data: projectsData, error: projectsError} = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const {data: agentsData, error: agentsError} = useQuery({
    queryKey: ["agents", user?.id],
    queryFn: getAgents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const {data: environmentsData, error: environmentsError} = useQuery({
    queryKey: ["environments", user?.id],
    queryFn: getEnvironments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (projectsError ?? agentsError ?? environmentsError) {
    toast({
      title: "Error loading search data",
      description: "Please try again later.",
    });
  }

  return (
    <div className={"relative ml-auto flex-1 md:grow-0"}>
      <div onClick={() => setIsOpen(true)}>
        <Search
          className={"absolute left-2.5 top-3 h-4 w-5 text-muted-foreground"}
        />
        <Input
          type="search"
          placeholder="Search"
          className={
            "w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          }
        />
      </div>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search"
          className={
            "w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          }
        />
        <CommandList>
          <CommandEmpty>No Results</CommandEmpty>
          <CommandGroup heading="Projects">
            {projectsData?.projects?.map((project) => (
              <CommandItem key={project.project_id} onSelect={() => {
                setIsOpen(false)
                window.location.href = `/project/${project?.project_id}`
              }}><span className={"font-bold"}>{project?.name}</span></CommandItem>
            ))}
          </CommandGroup>
          {agentsData && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Agents">
                {agentsData?.agents?.map((agent) => (
                  <CommandItem key={agent?.agent_id} onSelect={() => {
                    setIsOpen(false)
                    window.location.href = `/agent/${agent?.agent_id}`
                  }}>[<span className={"font-italic"}>{agent?.project_info?.name}</span>]&nbsp;<span className={"font-bold"}>{agent?.name}</span></CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          {environmentsData && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Environments">
                {environmentsData?.environments?.map((environment) => (
                  <CommandItem key={environment?.environment_id} onSelect={() => {
                    setIsOpen(false)
                    window.location.href = `/environment/${environment?.environment_id}`
                  }}>[<span className={"font-italic"}>{environment?.project_name}: {environment?.agent_name}</span>]&nbsp;<span className={"font-bold"}>{environment?.name}</span></CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
