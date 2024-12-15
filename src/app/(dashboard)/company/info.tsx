"use client"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import { useCompanyDetails } from "~/hooks/use-company-details";
import { Skeleton } from "~/components/ui/skeleton";
import { UploadButton } from "~/lib/utils/uploadthing";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { Copy } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import Image from "next/image";

interface IError {
  message: string
  title: string
}

interface uploadImageProps {
  companyId: string | undefined
  imageUrl: string
}

function uploadImage({companyId, imageUrl}: uploadImageProps): Error | void {
  if (!companyId) {
    return new Error("No company ID provided")
  }

  fetch(`/api/company/image`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({image: imageUrl, company_id: companyId}),
  }).then((response) => {
    if (!response.ok) {
      return new Error(`HTTP error! status: ${response.status}`);
    }
  }).catch((error: Error) => {
    return error
  })
}

export default function Info() {
  const {data: companyInfo, isLoading} = useCompanyDetails();
  const [iconOpen, setIconOpen] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorInfo, setErrorInfo] = useState({} as IError)
  const [imageURL, setImageURL] = useState("")
  const {toast} = useToast();

  let imageElement = <span className={"text-muted-foreground cursor-pointer"}>No Logo</span>
  useEffect(() => {
    if (companyInfo?.company?.logo.String !== "" && companyInfo?.company?.logo.String !== undefined) {
      setImageURL(companyInfo?.company?.logo.String)
    }
  }, [companyInfo, setImageURL])

  if (imageURL && imageURL !== "") {
    imageElement = <Image src={imageURL} alt={companyInfo?.company?.name ?? ""} width={50} height={50} className={"cursor-pointer"} />
  }

  if (isLoading) {
    return <Skeleton className="min-h-[10rem] min-w-fit rounded-xl" />
  }

  if (showError) {
    return (
      <Alert>
        <AlertTitle>{errorInfo.title}</AlertTitle>
        <AlertDescription>{errorInfo.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader className={"pb-2"}>
        <CardTitle>Info</CardTitle>
        <CardDescription>Update your company details here</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className={"grid gap-3"}>
          <li className={"flex items-center justify-between"}>
            <span className={"text-muted-foreground"}>Name</span>
            <span>{companyInfo?.company?.name}</span>
          </li>
          <li className={"flex items-center justify-between"}>
            <span className={"text-muted-foreground"}>Domain</span>
            <span>{companyInfo?.company?.domain}</span>
          </li>
          <li className={"flex items-center justify-between"}>
            <span className={"text-muted-foreground"}>Invite Code</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className={"cursor-pointer"}>{companyInfo?.company?.invite_code.slice(0, 12)}...</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className={"w-[20rem]"}>
                    {companyInfo?.company?.invite_code}
                    <Copy className={"h-5 w-5 mt-[-1.3rem] ml-[19rem] cursor-pointer"} onClick={() => {
                      navigator.clipboard.writeText(`${companyInfo?.company?.invite_code}`).then(() => {
                        toast({
                          title: "Flags.gg Invite Code Copied",
                          description: "The Flags.gg invite code have been copied to your clipboard",
                        })
                      })
                    }} />
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className={"flex items-center justify-between"}>
            <span className={"text-muted-foreground"}>Logo</span>
            <Dialog open={iconOpen} onOpenChange={setIconOpen}>
              <DialogTrigger asChild>
                {imageElement}
              </DialogTrigger>
              <DialogContent className={"sm:max-w-[425px]"}>
                <DialogHeader>
                  <DialogTitle>Update Company Image</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Upload a new image for your Company.
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
                        companyId: companyInfo?.company?.id,
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
                      imageElement = <Image src={res[0].url} alt={companyInfo?.company?.name ?? ""} width={50} height={50} className={"cursor-pointer"} />
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
      </CardContent>
    </Card>
  )
}
