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

export default function Info({environmentId}: {environmentId: string}) {
  const { data: environmentInfo, error, isLoading } = useEnvironment(environmentId)

  const [, setSelectedEnvironment] = useAtom(environmentAtom)
  useEffect(() => {
    if (environmentInfo) {
      setSelectedEnvironment(environmentInfo)
    }
  }, [environmentInfo, setSelectedEnvironment])

  if (isLoading) {
    return <Skeleton className="h-[125px] w-[250px] rounded-xl" />
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
        <li className={"flex items-stretch justify-items-end"}>
          <span className={"text-muted-foreground"}>Environment ID</span>
          &nbsp;
          <span>{environmentInfo.environment_id}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Enabled</span>
          <span><EnvironmentSwitch /></span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Secret Menu</span>
          <span>{environmentInfo.secret_menu.enabled ? "Enabled" : "Disabled"}</span>
        </li>
      </ul>
    </div>
  );
}
