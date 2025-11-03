"use client"

import {
  environmentAtom,
} from "~/lib/statemanager";
import {EnvironmentSwitch} from "./switch";
import {useAtom} from "jotai";
import {useEffect} from "react";
import { useEnvironment } from "~/hooks/use-environment";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Skeleton } from "~/components/ui/skeleton";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function Info({environmentId, menuId}: {environmentId: string, menuId: string}) {
  const { data: environmentInfo, error, isLoading } = useEnvironment(environmentId)

  const copyEnvId = () => {
    navigator.clipboard.writeText(environmentId ?? "").then(() => {
      toast(`${environmentInfo?.name} Environment ID Copied`, {
        description: `The ${environmentInfo?.name} environment id has been copied to your clipboard`,
      })
    })
  }

  const [, setSelectedEnvironment] = useAtom(environmentAtom)
  useEffect(() => {
    if (environmentInfo) {
      setSelectedEnvironment(environmentInfo)
    }
  }, [environmentInfo])

  if (isLoading) {
    return <Skeleton className="min-h-[10rem] min-w-fit rounded-xl" />
  }

  if (error ?? !environmentInfo) {
    return (
      <Alert>
        <AlertTitle>Error loading environment</AlertTitle>
        <AlertDescription>There was an error loading the environment</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={"grid gap-3"}>
      <ul className={"grid gap-3"}>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Environment ID</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className={"cursor-pointer"}>{environmentInfo?.environment_id.slice(0, 11)}...</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {environmentInfo?.environment_id}
                  <Copy className={"size-5 mt-[-1.3rem] ml-[19rem] cursor-pointer"} onClick={copyEnvId} />
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Enabled</span>
          <span><EnvironmentSwitch environmentId={environmentInfo.environment_id} /></span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Secret Menu</span>
          <span>{menuId ? (
            environmentInfo?.secret_menu?.enabled ? (
              <Link className={buttonVariants({ variant: "default" })} href={`/secretmenu/${menuId}`}>Enabled</Link>
            ) : (
              <Link className={buttonVariants({ variant: "secondary" })} href={`/secretmenu/${menuId}`}>Disabled</Link>
            )
          ) : (
            <Link className={buttonVariants({ variant: "secondary" })} href={`/secretmenu/`}>Create</Link>
          )}</span>
        </li>
      </ul>
    </div>
  );
}
