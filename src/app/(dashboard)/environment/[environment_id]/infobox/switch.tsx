"use client"

import {Switch} from "~/components/ui/switch";
import { useAtom } from "jotai";
import { environmentAtom } from "~/lib/statemanager";
import { useEnvironment } from "~/hooks/use-environment";
import { NewLoader } from "~/components/ui/new-loader";
import { IEnvironment } from "~/lib/interfaces";
import { toast } from "sonner";

async function enableDisableEnvironment(environmentInfo: IEnvironment) {
  try {
    const response = await fetch('/api/environment', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        environmentId: environmentInfo.environment_id,
        name: environmentInfo.name,
        enabled: environmentInfo.enabled,
      }),
    })
    if (!response.ok) {
      return new Error('Failed to enable/disable environment')
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to enable/disable environment: ${e.message}`)
    } else {
      console.error('An unknown error occurred', e)
    }
  }
}

export function EnvironmentSwitch({environmentId}: {environmentId: string}) {
  const [environmentInfo, setEnvironmentInfo] = useAtom(environmentAtom)
  const {data: environmentData, isLoading, error} = useEnvironment(environmentId)

  if (error) {
    toast("Error", {
      description: "Failed to fetch environment",
    });
  }

  if (isLoading) {
    return <NewLoader />
  }

  const onSwitch = () => {
    const updatedEnvironmentInfo = {...environmentInfo, enabled: !environmentInfo.enabled}
    try {
      setEnvironmentInfo(updatedEnvironmentInfo)
      enableDisableEnvironment(updatedEnvironmentInfo).then(() => {
        toast("Environment Updated", {
          description: "The environment has been updated",
        })
      }).catch((e) => {
        if (e instanceof Error) {
          throw new Error(`Failed to enable/disable environment: ${e.message}`)
        }
        throw new Error("Failed to enable/disable environment - unknown:", e)
      })
    } catch (e) {
      if (e instanceof Error) {
        toast("Environment Error", {
          description: `There was an error updating the environment: ${e.message}`,
        })
      } else {
        console.error("Error updating environment", e)
        toast("Environment Error", {
          description: `There was an error updating the environment`,
        })
      }
    }
  }

  return<Switch defaultChecked={environmentData?.enabled} name={"environment"} onCheckedChange={onSwitch} />
}
