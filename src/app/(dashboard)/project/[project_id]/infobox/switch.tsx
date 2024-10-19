"use client"

import { Switch } from "~/components/ui/switch";
import {useAtom} from "jotai";
import {projectAtom} from "~/lib/statemanager";
import {useToast} from "~/hooks/use-toast";

async function enableDisableProject(project_id: string, enabled: boolean, name: string) {
  try {
    const response = await fetch('/api/project', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId: project_id,
        enabled: enabled,
        name: name,
      }),
    })
    if (!response.ok) {
      return new Error('Failed to enable/disable project')
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to enable/disable project: ${e.message}`)
    } else {
      console.error('Failed to enable/disable project', e)
    }
  }
}

export function ProjectSwitch() {
  const [projectInfo, setProjectInfo] = useAtom(projectAtom)
  const {toast} = useToast()

  const onSwitch = () => {
    const updatedProjectInfo = {...projectInfo, enabled: !projectInfo.enabled}
    console.info("updatedProjectInfo", updatedProjectInfo, projectInfo)

    try {
      enableDisableProject(updatedProjectInfo.project_id, updatedProjectInfo.enabled, updatedProjectInfo.name).then(() => {
        toast({
          title: "Project Updated",
          description: `The project has been ${updatedProjectInfo.enabled ? "enabled" : "disabled"}`,
        })
        setProjectInfo(updatedProjectInfo)
      }).catch((e) => {
        if (e instanceof Error) {
          throw new Error(`Failed to enable/disable project: ${e.message}`)
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
        throw new Error("Failed to enable/disable project - unknown:", e)
      })
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "Error updating project",
          description: `There was an error updating the project: ${e.message}`,
        })
      } else {
        console.error("Error updating project", e)
        toast({
          title: "Error updating project",
          description: `There was an unknown error updating the project`,
        })
        console.error("Error updating project", e)
      }
    }
  }

  return <Switch defaultChecked={projectInfo.enabled} name={"project"} onCheckedChange={onSwitch} />
}