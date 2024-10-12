"use client"

import {Switch} from "~/components/ui/switch";
import { useAtom } from "jotai";
import { environmentAtom } from "~/lib/statemanager";
import { useToast } from "~/hooks/use-toast";

async function enableDisableEnvironment(environment_id: string, name: string, enabled: boolean) {
  try {
    const response = await fetch('/api/environment', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        environmentId: environment_id,
        name: name,
        enabled: enabled,
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

export function EnvironmentSwitch({environment_id}: { environment_id: string }) {
  const [environmentInfo, setEnvironmentInfo] = useAtom(environmentAtom)
  const {toast} = useToast()

  const onSwitch = () => {
    try {
      enableDisableEnvironment(environment_id, environmentInfo.name, !environmentInfo.enabled).then(() => {
        setEnvironmentInfo({...environmentInfo, enabled: !environmentInfo.enabled})
        toast({
          title: "Environment Updated",
          description: "The environment has been updated",
        })
      }).catch((e) => {
        if (e instanceof Error) {
          throw new Error(`Failed to enable/disable environment: ${e.message}`)
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
        throw new Error("Failed to enable/disable environment - unknown:", e)
      })
    } catch (e) {
      console.error("Error updating environment enabled", e)

      toast({
        title: "Environment Error",
        description: "There was an error updating the environment",
      })
    }
  }

  return (
    <Switch defaultChecked={environmentInfo.enabled} name={"environment"} onCheckedChange={onSwitch} />
  )
}
