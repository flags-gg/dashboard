"use client"

import { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { projectAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Trash2 } from "lucide-react";
import ProjectInfo from "~/app/(dashboard)/project/[project_id]/infobox/info";
import { Button } from "~/components/ui/button";

async function deleteProject(project_id: string): Promise<null | Error> {
  try {
    const response = await fetch(`/api/project`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: project_id,
      }),
      cache: "no-store",
    })
    if (!response.ok) {
      return new Error("Failed to delete project")
    }

    return null
  }
  catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to delete project: ${e.message}`)
    } else {
      console.error("deleteProject", e)
    }
  }

  return Error("Failed to delete project")
}

export default function Delete({project_id}: {project_id: string}) {
  const [openDelete, setOpenDelete] = useState(false);
  const {toast} = useToast();
  const router = useRouter()
  const [projectInfo] = useAtom(projectAtom);

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogTrigger asChild>
        <Trash2 className={"h-5 w-5"} style={{
          marginTop: "0.4rem",
          cursor: "pointer",
        }} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project {ProjectInfo.name}</DialogTitle>
          <DialogDescription>Are you sure you want to delete this project?</DialogDescription>
        </DialogHeader>
        <div className={"flex justify-between"}>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button variant={"destructive"} onClick={() => {
            setOpenDelete(false)
            deleteProject(project_id).then(() => {
              toast({
                title: "Project Deleted",
                description: "The project has been deleted",
              })
              router.push(`/projects?ts=${Date.now()}`)
            }).catch((e) => {
              if (e instanceof Error) {
                toast({
                  title: "Error Deleting Project",
                  description: `There was an error deleting the project: ${e.message}`,
                })
                return
              }

              toast({
                title: "Error Deleting Project",
                description: `There was an unknown error deleting the project: ${e}`,
              })
            })
            router.push(`/projects?ts=${Date.now()}`)
          }}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}