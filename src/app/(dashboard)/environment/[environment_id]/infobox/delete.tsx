"use client"

import { useFlags } from "@flags-gg/react-library";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { agentAtom, environmentAtom } from "~/lib/statemanager";

async function deleteEnvironment(environment_id: string): Promise<null | Error> {
  try {
    const response = await fetch(`/api/environment`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        environmentId: environment_id,
      }),
      cache: "no-store",
    })
    if (!response.ok) {
      return new Error("Failed to delete environment")
    }

    return null
  }
  catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to delete environment: ${e.message}`)
    } else {
      console.error("deleteEnvironment", e)
    }
  }

  return Error("Failed to delete environment")
}

export default function Delete({environment_id}: {environment_id: string}) {
  const [openDelete, setOpenDelete] = useState(false);
  const {is} = useFlags();
  const {toast} = useToast();
  const router = useRouter()
  const [environmentInfo] = useAtom(environmentAtom)
  const [agentInfo] = useAtom(agentAtom)

  return (
    <Tooltip>
      <TooltipTrigger>
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogTrigger asChild>
            <Button variant={"outline"} className={"bg-muted/10 border-0"} size={"icon"} style={{
              marginTop: "-0.4rem",
            }}>
              <Trash2 className={"h-5 w-5"} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Environment {environmentInfo.name}</DialogTitle>
              <DialogDescription>Are you sure you want to delete this environment?</DialogDescription>
            </DialogHeader>
            <div className={"flex justify-between"}>
              <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
              <Button variant={"destructive"} onClick={() => {
                setOpenDelete(false)
                deleteEnvironment(environment_id).then(() => {
                  toast({
                    title: "Environment Deleted",
                    description: "The environment has been deleted",
                  })
                  router.push(`/agent/${agentInfo.agent_id}?ts=${Date.now()}`)
                }).catch((e) => {
                  if (e instanceof Error) {
                    throw new Error(`Failed to delete environment: ${e.message}`)
                  }
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
                  throw new Error("Failed to delete environment - unknown:", e)
                })
              }}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      </TooltipTrigger>
      <TooltipContent sideOffset={4}>Delete Environment</TooltipContent>
    </Tooltip>
  )
}