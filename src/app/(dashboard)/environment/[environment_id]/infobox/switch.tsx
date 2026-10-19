"use client"

import {Switch} from "~/components/ui/switch";
import { useEnvironment } from "~/hooks/use-environment";
import { toast } from "sonner";
import { Spinner } from "~/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";

async function enableDisableEnvironment(environmentId: string, name: string, enabled: boolean) {
  const response = await fetch('/api/environment', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      environmentId: environmentId,
      name: name,
      enabled: enabled,
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to enable/disable environment')
  }
}

export function EnvironmentSwitch({environmentId}: {environmentId: string}) {
  const queryClient = useQueryClient()
  const {data: environmentData, isLoading, error} = useEnvironment(environmentId)

  if (error) {
    toast("Error", {
      description: "Failed to fetch environment",
    });
  }

  if (isLoading || !environmentData) {
    return <Spinner />
  }

  const onSwitch = () => {
    const enabled = !environmentData.enabled
    enableDisableEnvironment(environmentId, environmentData.name, enabled).then(() => {
      toast("Environment Updated", {
        description: "The environment has been updated",
      })
      void queryClient.invalidateQueries({ queryKey: ["environment", environmentId] })
    }).catch((e: unknown) => {
      toast("Environment Error", {
        description: `There was an error updating the environment: ${e instanceof Error ? e.message : "unknown error"}`,
      })
    })
  }

  return <Switch checked={environmentData.enabled} name={"environment"} onCheckedChange={onSwitch} />
}
