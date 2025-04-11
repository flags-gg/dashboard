"use client"

import {projectAtom} from "~/lib/statemanager";
import {useAtom} from "jotai";
import {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import {UploadButton} from "~/lib/utils/uploadthing";
import Image from "next/image";
import { ShieldPlus } from "lucide-react";
import { ProjectSwitch } from "./switch";
import { Skeleton } from "~/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { useProjectLimits } from "~/hooks/use-project-limits";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface IError {
  message: string
  title: string
}

interface uploadImageProps {
  projectId: string
  imageUrl: string
}
function uploadImage({projectId, imageUrl}: uploadImageProps): Error | void {
  fetch(`/api/project/image`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({image: imageUrl, project_id: projectId}),
  }).then((response) => {
    if (!response.ok) {
      return new Error(`HTTP error! status: ${response.status}`);
    }
  }).catch((error: Error) => {
    return error
  })
}

export default function ProjectInfo({project_id}: {project_id: string}) {
  const [projectInfo] = useAtom(projectAtom)
  const [, setSelectedProject] = useAtom(projectAtom)
  const [iconOpen, setIconOpen] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorInfo, setErrorInfo] = useState({} as IError)
  const [imageURL, setImageURL] = useState("")
  const { data: projectLimits, isLoading, error } = useProjectLimits(project_id);
  const {user} = useUser();

  useEffect(() => {
    if (user) {
      setSelectedProject(projectInfo)
      setImageURL(projectInfo.logo)
    }
  }, [projectInfo, setSelectedProject, setImageURL, user])

  if (!user) {
    return <></>
  }

  if (error) {
    setShowError(true)
    setErrorInfo({
      message: "Error loading company limits",
      title: "Error loading company limits",
    });
  }

  if (showError) {
    toast(errorInfo.title, {
      description: errorInfo.message,
      duration: 5000,
    })
  }

  if (isLoading) {
    return <Skeleton className="min-h-[10rem] min-w-fit rounded-xl" />
  }

  let imageElement = <ShieldPlus className={"size-5 cursor-pointer"} />
  if (imageURL && imageURL !== "") {
    imageElement =
      <Image src={imageURL} alt={projectInfo.name} width={50} height={50} className={"cursor-pointer"} />
  }

  return (
    <div className={"grid gap-3"}>
      <ul className={"grid gap-3"}>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Project ID</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className={"cursor-pointer"}>{project_id.slice(0, 11)}...</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{project_id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Name</span>
          <span>{projectInfo.name}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Max Agents</span>
          <span>{projectLimits?.allowed ?? 0}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Agents Used</span>
          <span>{projectLimits?.used ?? 0}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Enabled</span>
          <span><ProjectSwitch projectId={projectInfo.project_id} /></span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Logo</span>
          <Dialog open={iconOpen} onOpenChange={setIconOpen}>
            <DialogTrigger asChild>
              {imageElement}
            </DialogTrigger>
            <DialogContent className={"sm:max-w-[425px]"}>
              <DialogHeader>
                <DialogTitle>Update Project Image</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Upload a new image for your project.
              </DialogDescription>
              <div className={"grid gap-4 py-4"}>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (!res?.[0]?.url) {
                      setShowError(true)
                      setErrorInfo({
                        title: "Error uploading image",
                        message: "No image URL returned",
                      })
                      setIconOpen(false)
                      return
                    }
                    const upload = uploadImage({
                      projectId: project_id,
                      imageUrl: res[0].url,
                    })
                    if (upload instanceof Error) {
                      setShowError(true)
                      setErrorInfo({
                        title: "Error uploading image",
                        message: upload.message,
                      })
                    }
                    setIconOpen(false)
                    setImageURL(res[0].url)
                  }}
                  onUploadError={(error: Error) => {
                    setShowError(true)
                    setErrorInfo({
                      title: "Error uploading image",
                      message: error.message,
                    })
                    setIconOpen(false)
                  }} />
              </div>
            </DialogContent>
          </Dialog>
        </li>
      </ul>
    </div>
  )
}
