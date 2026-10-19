"use client"

import { Switch } from "~/components/ui/switch";
import {useAtom} from "jotai";
import {projectAtom} from "~/lib/statemanager";
import { useProject } from "~/hooks/use-project";
import { useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "~/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";

async function enableDisableProject(project_id: string, enabled: boolean, name: string) {
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
    throw new Error('Failed to enable/disable project')
  }
}

export function ProjectSwitch({projectId}: {projectId: string}) {
  const [, setProjectInfo] = useAtom(projectAtom)
  const queryClient = useQueryClient()
  const {data: projectData, isLoading, error} = useProject(projectId)

  // ponytail: still feeds projectAtom for its remaining readers, goes with FLA-66
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
    return <Spinner />
  }

  const onSwitch = () => {
    const enabled = !projectData.enabled
    enableDisableProject(projectId, enabled, projectData.name).then(() => {
      toast("Project Updated", {
        description: `The project has been ${enabled ? "enabled" : "disabled"}`,
      })
      void queryClient.invalidateQueries({ queryKey: ["project", projectId] })
    }).catch((e: unknown) => {
      toast("Error updating project", {
        description: `There was an error updating the project: ${e instanceof Error ? e.message : "unknown error"}`,
      })
    })
  }

  return <Switch checked={projectData.enabled} name={"project-switch"} onCheckedChange={onSwitch} />
}
