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
import {Tooltip, TooltipContent, TooltipTrigger} from "~/components/ui/tooltip";
import {useAtom} from "jotai";
import {projectAtom, agentAtom, environmentAtom, secretMenuAtom} from "~/lib/statemanager";
import { useFlags } from "@flags-gg/react-library";

export default function SideBar() {
  const [selectedProject] = useAtom(projectAtom);
  const [selectedAgent] = useAtom(agentAtom);
  const [selectedEnvironment] = useAtom(environmentAtom);
  const [selectedMenu] = useAtom(secretMenuAtom);
  const {is} = useFlags()

  return (
    <aside className={"fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex"}>
      <nav className={"flex flex-col items-center gap-4 px-2 sm:py-5"}>
        <ul>
          <li>
            <Link href={"/"} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
              <Home className={"h-5 w-5"} />
              <span className={"sr-only"}>Home</span>
            </Link>
          </li>
          <li>
            <Link href={"/company"} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
              <Tooltip>
                <TooltipTrigger>
                  <Building2 className={"h-5 w-5"} />
                  <span className={"sr-only"}>Company</span>
                </TooltipTrigger>
                <TooltipContent sideOffset={4}>Company</TooltipContent>
              </Tooltip>
            </Link>
          </li>
          <li>
            <Link href={"/projects"} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
              <Tooltip>
                <TooltipTrigger>
                  <SquareGanttChart className={"h-5 w-5"} />
                  <span className={"sr-only"}>Projects</span>
                </TooltipTrigger>
                <TooltipContent sideOffset={4}>Projects</TooltipContent>
              </Tooltip>
            </Link>
          </li>
          {selectedProject.project_id && (
            <li>
              <Link href={`/project/${selectedProject.project_id}`} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
                <Tooltip>
                  <TooltipTrigger>
                    <SquareKanban className={"h-5 w-5"} />
                    <span className={"sr-only"}>{selectedProject.name}</span>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={4}>{selectedProject.name}</TooltipContent>
                </Tooltip>
              </Link>
            </li>
          )}
          {selectedAgent.agent_id && (
            <li>
              <Link href={`/agent/${selectedAgent.agent_id}`} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
                <Tooltip>
                  <TooltipTrigger>
                    <VenetianMask className={"h-5 w-5"} />
                    <span className={"sr-only"}>{selectedAgent.name}</span>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={4}>{selectedAgent.name}</TooltipContent>
                </Tooltip>
              </Link>
            </li>
          )}
          {is("flags")?.enabled() && selectedEnvironment.environment_id && (
            <li>
              <Link href={`/environment/${selectedEnvironment.environment_id}`} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
                <Tooltip>
                  <TooltipTrigger>
                    <Container className={"h-5 w-5"} />
                    <span className={"sr-only"}>{selectedEnvironment.name}</span>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={4}>{selectedEnvironment.name}</TooltipContent>
                </Tooltip>
              </Link>
            </li>
          )}
          {selectedMenu.menu_id && (
            <li>
              <Link href={`/secretmenu/${selectedMenu.menu_id}`} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
                <Tooltip>
                  <TooltipTrigger>
                    <SquareMenu className={"h-5 w-5"} />
                    <span className={"sr-only"}>Secret Menu Config</span>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={4}>Secret Menu Config</TooltipContent>
                </Tooltip>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  )
}

