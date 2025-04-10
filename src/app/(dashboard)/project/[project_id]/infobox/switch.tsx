"use client"

import { Switch } from "~/components/ui/switch";
import {useAtom} from "jotai";
import {projectAtom} from "~/lib/statemanager";
import { useProject } from "~/hooks/use-project";
import { NewLoader } from "~/components/ui/new-loader";
import { useEffect } from "react";
import { toast } from "sonner";

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

export function ProjectSwitch({projectId}: {projectId: string}) {
  const [projectInfo, setProjectInfo] = useAtom(projectAtom)
  const {data: projectData, isLoading, error} = useProject(projectId)

  useEffect(() => {
    if (projectData) {
      setProjectInfo(projectData)
    }
  }, [projectData])

  if (error) {
    toast("Error loading project", {
      description: "Please try again later.",
    });
    return null
  }

  if (!projectData || isLoading) {
    return <NewLoader />
  }

  const onSwitch = () => {
    const updatedProjectInfo = {...projectInfo, enabled: !projectInfo.enabled}

    try {
      enableDisableProject(updatedProjectInfo.project_id, updatedProjectInfo.enabled, updatedProjectInfo.name).then(() => {
        toast("Project Updated", {
          description: `The project has been ${updatedProjectInfo.enabled ? "enabled" : "disabled"}`,
        })
        setProjectInfo(updatedProjectInfo)
      }).catch((e) => {
        if (e instanceof Error) {
          throw new Error(`Failed to enable/disable project: ${e.message}`)
        }
        throw new Error("Failed to enable/disable project - unknown:", e)
      })
    } catch (e) {
      if (e instanceof Error) {
        toast("Error updating project", {
          description: `There was an error updating the project: ${e.message}`,
        })
      } else {
        console.error("Error updating project", e)
        toast("Error updating project", {
          description: `There was an unknown error updating the project`,
        })
        console.error("Error updating project", e)
      }
    }
  }

  return <Switch defaultChecked={projectInfo?.enabled} name={"project"} onCheckedChange={onSwitch} />
}