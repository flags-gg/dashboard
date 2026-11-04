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
import { Button } from "~/components/ui/button";
import { CopyValue, SettingRow, SettingsSection, SettingsSkeleton } from "~/components/settings";
import Name from "./name";
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
  }, [projectInfo, user])

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
    return <SettingsSkeleton />
  }

  let imageElement = <Button variant={"outline"} size={"icon"} aria-label={"Upload logo"}><ShieldPlus className={"size-5"} /></Button>
  if (imageURL && imageURL !== "") {
    imageElement =
      <button type={"button"} aria-label={"Change logo"} className={"rounded"}><Image src={imageURL} alt={projectInfo.name} width={40} height={40} className={"size-10 rounded object-cover"} /></button>
  }

  return (
    <SettingsSection title={"General"}>
      <SettingRow label={"Name"}><Name project_id={project_id} /></SettingRow>
      <SettingRow label={"Project ID"} description={"Used by SDKs together with the agent and environment IDs."}>
        <CopyValue value={project_id} what={"Project ID"} />
      </SettingRow>
      <SettingRow label={"Enabled"} description={"A disabled project serves no flags to any of its agents."}>
        <ProjectSwitch projectId={project_id} />
      </SettingRow>
      <SettingRow label={"Logo"} description={"Click to upload a new one."}>
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
      </SettingRow>
      <SettingRow label={"Agents"}>
        <span className={"text-sm tabular-nums"}>{projectLimits?.used ?? 0} of {projectLimits?.allowed ?? 0}</span>
      </SettingRow>
    </SettingsSection>
  )
}
