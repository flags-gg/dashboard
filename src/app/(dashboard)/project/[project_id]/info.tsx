"use client"

import {type Session} from "next-auth";
import {type BreadCrumb, breadCrumbAtom, type IProject, projectAtom} from "~/lib/statemanager";
import {useAtom} from "jotai";
import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "~/components/ui/dialog";
import {UploadButton} from "~/utils/uploadthing";
import {Alert, AlertDescription, AlertTitle} from "~/components/ui/alert";

interface IError {
  message: string
  title: string
}

export default function ProjectInfo({session, projectInfo, flagServer}: {session: Session, projectInfo: IProject, flagServer: string}) {
  if (!session) {
    throw new Error('No session found')
  }

  const [, setSelectedProject] = useAtom(projectAtom)
  useEffect(() => {
    setSelectedProject(projectInfo)
  }, [projectInfo, setSelectedProject])

  const [, setBreadcrumbs] = useAtom(breadCrumbAtom)
  useEffect(() => {
    setBreadcrumbs([])
    const breadcrumbs: Array<BreadCrumb> = [
      {title: "Projects", url: "/projects"},
      {title: projectInfo.name, url: `/project/${projectInfo.project_id}`},
    ]
    setBreadcrumbs(breadcrumbs)
  }, [projectInfo, setBreadcrumbs])

  const [iconOpen, setIconOpen] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorInfo, setErrorInfo] = useState({} as IError)

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
          <span>{projectInfo.name}</span>
        </li>
        <li className={"flex items-center justify-between"}>
          <span className={"text-muted-foreground"}>Logo</span>
          <Dialog open={iconOpen} onOpenChange={setIconOpen}>
            <DialogTrigger asChild>
              <img id={"projectImage"} src={projectInfo.logo} alt={projectInfo.name} width={"50px"} height={"50px"} style={{
                "cursor": "pointer",
              }} />
            </DialogTrigger>
            <DialogContent className={"sm:max-w-[425px]"}>
              <DialogHeader>
                <DialogTitle>Update Project Image</DialogTitle>
              </DialogHeader>
              <div className={"grid gap-4 py-4"}>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    fetch(`${flagServer}/project/${projectInfo.project_id}/image`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        "x-user-access-token": session.user.access_token,
                        "x-user-subject": session.user.id,
                      },
                      body: JSON.stringify({image: res[0].url}),
                    }).then((response) => {
                      if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                      }
                      return response.json();
                    }).then((data) => {
                      document.getElementById("projectImage")!.setAttribute("src", res[0].url)
                    }).catch((error) => {
                      setShowError(true)
                      setErrorInfo({
                        title: "Error updating image",
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        message: error.message,
                      })
                    }).finally(() => {
                      setIconOpen(false)
                    });
                  }}
                  onUploadError={(error: Error) => {
                    setShowError(true)
                    setErrorInfo({
                      title: "Error uploading image",
                      message: error.message,
                    })
                  }} />
              </div>
            </DialogContent>
          </Dialog>
        </li>
      </ul>
    </div>
  )
}
