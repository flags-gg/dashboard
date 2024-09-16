"use client"

import {type Session} from "next-auth";
import {type IProject, projectAtom} from "~/lib/statemanager";
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
import {UploadButton} from "~/utils/uploadthing";
import {Alert, AlertDescription, AlertTitle} from "~/components/ui/alert";
import Image from "next/image";

interface IError {
  message: string
  title: string
}

interface uploadImageProps {
  flagServer: string
  projectId: string
  accessToken: string
  userId: string
  imageUrl: string
}
function uploadImage({flagServer, projectId, accessToken, userId, imageUrl}: uploadImageProps): Error | void {
  fetch(`${flagServer}/project/${projectId}/image`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-access-token": accessToken,
      "x-user-subject": userId,
    },
    body: JSON.stringify({image: imageUrl}),
  }).then((response) => {
    if (!response.ok) {
      return new Error(`HTTP error! status: ${response.status}`);
    }
  }).catch((error: Error) => {
    return error
  })
}

export default function ProjectInfo({session, projectInfo, flagServer}: {session: Session, projectInfo: IProject, flagServer: string}) {
  if (!session) {
    throw new Error('No session found')
  }

  const [selectedProject, setSelectedProject] = useAtom(projectAtom)
  useEffect(() => {
    setSelectedProject(projectInfo)
  }, [projectInfo, setSelectedProject])

  const [iconOpen, setIconOpen] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorInfo, setErrorInfo] = useState({} as IError)
  const [imageURL, setImageURL] = useState(projectInfo.logo)

  if (showError) {
    return (
      <Alert>
        <AlertTitle>{errorInfo.title}</AlertTitle>
        <AlertDescription>{errorInfo.message}</AlertDescription>
      </Alert>
    )
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
          <span className={"text-muted-foreground"}>Logo</span>
          <Dialog open={iconOpen} onOpenChange={setIconOpen}>
            <DialogTrigger asChild>
              <Image src={imageURL} alt={selectedProject.name} width={50} height={50} style={{
                "cursor": "pointer",
              }} />
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
                      flagServer: flagServer,
                      projectId: projectInfo.project_id,
                      accessToken: session.user.access_token!,
                      userId: session.user.id,
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