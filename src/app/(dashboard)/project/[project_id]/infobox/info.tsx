"use client"

import {type Session} from "next-auth";
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
import {Alert, AlertDescription, AlertTitle} from "~/components/ui/alert";
import Image from "next/image";
import { useCompanyLimits } from "~/hooks/use-company-limits";
import { ShieldPlus } from "lucide-react";
import { ProjectSwitch } from "./switch";
import { Skeleton } from "~/components/ui/skeleton";

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

export default function ProjectInfo({session}: {session: Session}) {
  if (!session) {
    throw new Error('No session found')
  }
  const [projectInfo] = useAtom(projectAtom)
  const [selectedProject, setSelectedProject] = useAtom(projectAtom)
  const [iconOpen, setIconOpen] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorInfo, setErrorInfo] = useState({} as IError)
  const [imageURL, setImageURL] = useState("")
  const { data: companyLimits, isLoading, error } = useCompanyLimits(session);

  useEffect(() => {
    setSelectedProject(projectInfo)
    setImageURL(projectInfo.logo)
  }, [projectInfo, setSelectedProject, setImageURL])

  if (error) {
    setShowError(true)
    setErrorInfo({
      message: "Error loading company limits",
      title: "Error loading company limits",
    });
  }

  let agentsUsed = 0
  for (const agent of companyLimits?.agents?.used ?? []) {
    if (agent.project_id === projectInfo.project_id) {
      agentsUsed = agent.used
    }
  }

  if (showError) {
    return (
      <Alert>
        <AlertTitle>{errorInfo.title}</AlertTitle>
        <AlertDescription>{errorInfo.message}</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return <Skeleton className="min-h-[10rem] min-w-fit rounded-xl" />
  }

  let imageElement
  if (imageURL) {
    imageElement =
      <Image src={imageURL} alt={selectedProject.name} width={50} height={50} className={"cursor-pointer"} />
  } else {
    imageElement = <ShieldPlus className={"h-5 w-5 cursor-pointer"} />
  }

  return (
    <div className={"grid gap-3"}>
      <ul className={"grid gap-3"}>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Project ID</span>
          <span>{projectInfo.project_id}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Name</span>
          <span>{selectedProject.name}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Max Agents</span>
          <span>{companyLimits?.agents?.allowed ?? 0}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Agents Used</span>
          <span>{agentsUsed}</span>
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
                      projectId: projectInfo.project_id,
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
