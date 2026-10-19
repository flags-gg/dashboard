"use client"

import { Switch } from "~/components/ui/switch";
import { useAgent } from "~/hooks/use-agent";
import {toast} from "sonner";
import { Spinner } from "~/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";

async function enableDisableAgent(agent_id: string, enabled: boolean, agentName: string) {
  const response = await fetch('/api/agent', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agentId: agent_id,
      name: agentName,
      enabled: enabled,
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to enable/disable agent')
  }
}

export function AgentSwitch({agent_id}: {agent_id: string}) {
  const queryClient = useQueryClient()
  const {data: agentData, isLoading} = useAgent(agent_id)

  if (isLoading || !agentData) {
    return <Spinner />
  }

  const onSwitch = () => {
    const enabled = !agentData.enabled
    enableDisableAgent(agent_id, enabled, agentData.name).then(() => {
      toast("Agent Updated", {
        description: `The agent has been ${enabled ? "enabled" : "disabled"}`,
      })
      void queryClient.invalidateQueries({ queryKey: ["agent", agent_id] })
    }).catch((e: unknown) => {
      toast("Error updating agent", {
        description: `There was an error updating the agent: ${e instanceof Error ? e.message : "unknown error"}`,
      })
    })
  }

  return (
    <Switch checked={agentData.enabled} name={"agent"} onCheckedChange={onSwitch} />
  )
}
