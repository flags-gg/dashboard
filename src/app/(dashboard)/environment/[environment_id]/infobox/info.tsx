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
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export default function Info({environmentId, menuId}: {environmentId: string, menuId: string}) {
  const { data: environmentInfo, error, isLoading } = useEnvironment(environmentId)

  const [, setSelectedEnvironment] = useAtom(environmentAtom)
  useEffect(() => {
    if (environmentInfo) {
      setSelectedEnvironment(environmentInfo)
    }
  }, [environmentInfo, setSelectedEnvironment])

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
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Environment ID</TableCell>
          <TableCell className={"text-right"}>{environmentInfo.environment_id}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Enabled</TableCell>
          <TableCell className={"text-right"}><EnvironmentSwitch environmentId={environmentInfo.environment_id} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Secret Menu</TableCell>
          <TableCell className={"text-right"}>{environmentInfo.secret_menu.enabled ? "Enabled" : "Disabled"}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
