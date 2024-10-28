"use client"

import { useEffect, useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FlagAgent } from "~/lib/statemanager";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAgent } from "~/hooks/use-agent";

async function deleteAgent(agent_id: string): Promise<null | Error> {
  try {
    const response = await fetch(`/api/agent`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId: agent_id,
      }),
      cache: "no-store",
    })
    if (!response.ok) {
      return new Error("Failed to delete agent")
    }

    return null
  }
  catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to delete agent: ${e.message}`)
    } else {
      console.error("deleteAgent", e)
    }
  }

  return Error("Failed to delete agent")
}

export default function Delete({agent_id}: {agent_id: string}) {
  const [openDelete, setOpenDelete] = useState(false);
  const {toast} = useToast();
  const router = useRouter()
  const [AgentInfo, setAgentInfo] = useState<FlagAgent | null>(null)
  const {data: agentData, isLoading} = useAgent(agent_id)

  useEffect(() => {
    if (agentData) {
      setAgentInfo(agentData)
    }
  }, [agentData, setAgentInfo])

  if (isLoading) {
    return null
  }

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogTrigger asChild>
        <Trash2 className={"h-5 w-5 mt-1.5 cursor-pointer"}/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Agent {AgentInfo?.name}</DialogTitle>
          <DialogDescription>Are you sure you want to delete this agent?</DialogDescription>
        </DialogHeader>
        <div className={"flex justify-between"}>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button variant={"destructive"} onClick={() => {
            setOpenDelete(false)
            deleteAgent(agent_id).then(() => {
              toast({
                title: "Agent Deleted",
                description: "The agent has been deleted",
              })
              router.push(`/project/${AgentInfo?.project_info?.project_id}?ts=${Date.now()}`)
            }).catch((e) => {
              if (e instanceof Error) {
                toast({
                  title: "Error Deleting Agent",
                  description: `There was an error deleting the agent: ${e.message}`,
                })
                return
              }

              toast({
                title: "Error Deleting Agent",
                description: `There was an unknown error deleting the agent: ${e}`,
              })
            })
          }}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}