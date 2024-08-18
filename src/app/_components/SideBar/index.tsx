"use client"
import Link from "next/link";
import {
  Building,
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
import {projectAtom, agentAtom, menuAtom, environmentAtom} from "~/lib/statemanager";

export default function SideBar() {
  const [selectedProject] = useAtom(projectAtom);
  const [selectedAgent] = useAtom(agentAtom);
  const [selectedEnvironment] = useAtom(environmentAtom);
  const [selectedMenu] = useAtom(menuAtom);

  return (
    <aside className={"fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex"}>
      <nav className={"flex flex-col items-center gap-4 px-2 sm:py-5"}>
        <Link href={"/"} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
          <Home className={"h-5 w-5"} />
          <span className={"sr-only"}>Home</span>
        </Link>
        <Link href={"/company"} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
          <Tooltip>
            <TooltipTrigger>
              <Building2 className={"h-5 w-5"} />
              <span className={"sr-only"}>Company</span>
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>Company</TooltipContent>
          </Tooltip>
        </Link>
        <Link href={"/company/account"} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
          <Tooltip>
            <TooltipTrigger>
              <Building className={"h-5 w-5"} />
              <span className={"sr-only"}>Company Account</span>
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>Company Account</TooltipContent>
          </Tooltip>
        </Link>
        <Link href={"/projects"} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
          <Tooltip>
            <TooltipTrigger>
              <SquareGanttChart className={"h-5 w-5"} />
              <span className={"sr-only"}>Projects</span>
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>Projects</TooltipContent>
          </Tooltip>
        </Link>
        {selectedProject && (
          <Link href={`/project/${selectedProject.id}`} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
            <Tooltip>
              <TooltipTrigger>
                <SquareKanban className={"h-5 w-5"} />
                <span className={"sr-only"}>{selectedProject.name}</span>
              </TooltipTrigger>
              <TooltipContent sideOffset={4}>{selectedProject.name}</TooltipContent>
            </Tooltip>
          </Link>
        )}
        {selectedAgent && (
          <Link href={`/agent/${selectedAgent.id}`} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
            <Tooltip>
              <TooltipTrigger>
                <VenetianMask className={"h-5 w-5"} />
                <span className={"sr-only"}>{selectedAgent.name}</span>
              </TooltipTrigger>
              <TooltipContent sideOffset={4}>{selectedAgent.name}</TooltipContent>
            </Tooltip>
          </Link>
        )}
        {selectedEnvironment && (
          <Link href={`/environment/${selectedEnvironment.id}`} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
            <Tooltip>
              <TooltipTrigger>
                <Container className={"h-5 w-5"} />
                <span className={"sr-only"}>{selectedEnvironment.name}</span>
              </TooltipTrigger>
              <TooltipContent sideOffset={4}>{selectedEnvironment.name}</TooltipContent>
            </Tooltip>
          </Link>
        )}
        {selectedMenu && (
          <Link href={`/secretmenu/${selectedMenu.id}`} className={"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"}>
            <Tooltip>
              <TooltipTrigger>
                <SquareMenu className={"h-5 w-5"} />
                <span className={"sr-only"}>Secret Menu Config</span>
              </TooltipTrigger>
              <TooltipContent sideOffset={4}>Secret Menu Config</TooltipContent>
            </Tooltip>
          </Link>
        )}
      </nav>
    </aside>
  )
}
