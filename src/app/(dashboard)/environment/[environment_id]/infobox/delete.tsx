"use client"

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { agentAtom, environmentAtom } from "~/lib/statemanager";
import { toast } from "sonner";

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
  const router = useRouter()
  const [environmentInfo] = useAtom(environmentAtom)
  const [agentInfo] = useAtom(agentAtom)

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogTrigger asChild>
        <Trash2 className={"size-5 mt-1.5 cursor-pointer"}/>
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
              toast("Environment Deleted", {
                description: "The environment has been deleted",
              })
              router.push(`/agent/${agentInfo.agent_id}?ts=${Date.now()}`)
            }).catch((e) => {
              if (e instanceof Error) {
                toast("Error Deleting Environment", {
                  description: `There was an error deleting the environment: ${e.message}`,
                })
                return
              }

              toast("Error Deleting Environment", {
                description: `There was an unknown error deleting the environment: ${e}`,
              })
            })
          }}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}