"use client"

import { Switch } from "~/components/ui/switch";
import { agentAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { useToast } from "~/hooks/use-toast";
import { useAgent } from "~/hooks/use-agent";
import { NewLoader } from "~/components/ui/new-loader";

async function enableDisableAgent(agent_id: string, enabled: boolean, agentName: string) {
  try {
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
      return new Error('Failed to enable/disable agent')
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to enable/disable agent: ${e.message}`)
    } else {
      console.error('Failed to enable/disable agent', e)
    }
  }
}

export function AgentSwitch({agent_id}: {agent_id: string}) {
  const [agentInfo, setAgentInfo] = useAtom(agentAtom)
  const {data: agentData, isLoading} = useAgent(agent_id)
  const {toast} = useToast()

  if (isLoading) {
    return <NewLoader />
  }

  const onSwitch = () => {
    const updatedAgentInfo = {...agentInfo, enabled: !agentInfo.enabled}
    console.info("updatedAgentInfo", updatedAgentInfo, agentInfo)

    try {
      enableDisableAgent(updatedAgentInfo.agent_id, updatedAgentInfo.enabled, updatedAgentInfo.name).then(() => {
        toast({
          title: "Agent Updated",
          description: `The agent has been ${updatedAgentInfo.enabled ? "enabled" : "disabled"}`,
        })
        setAgentInfo(updatedAgentInfo)
      }).catch((e) => {
        if (e instanceof Error) {
          throw new Error(`Failed to enable/disable agent: ${e.message}`)
        }
        throw new Error("Failed to enable/disable agent - unknown:", e)
      })
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "Error updating agent",
          description: `There was an error updating the agent: ${e.message}`,
        })
      } else {
        toast({
          title: "Error updating agent",
          description: `There was an unknown error updating the agent`,
        })
        console.error("Error updating agent", e)
      }
    }
  }

  return (
    <Switch defaultChecked={agentData?.enabled} name={"agent"} onCheckedChange={onSwitch} />
  )
}