"use client"

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { UploadButton } from "~/lib/utils/uploadthing";
import Image from "next/image";
import { useUserDetails } from "~/hooks/use-user-details";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface IError {
  message: string
  title: string
}

function uploadImage({ imageUrl }: { imageUrl: string }): Error | void {
  fetch(`/api/user/image`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageUrl }),
  })
    .then((response) => {
      if (!response.ok) {
        return new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error: Error) => {
      return error;
    });
}

export default function UserImage() {
  const [iconOpen, setIconOpen] = useState(false)
  const [errorInfo, setErrorInfo] = useState({} as IError)
  const [showError, setShowError] = useState(false)
  const [imageURL, setImageURL] = useState("")
  const {user} = useUser();

  const { data: userData } = useUserDetails(user?.id ?? "");
  useEffect(() => {
    if (userData) {
      setImageURL(userData.avatar)
    }
  }, [userData])

  let imageElement
  if (imageURL) {
    imageElement =
      <Image src={imageURL} alt={userData?.first_name + " " + userData?.last_name} height={200} width={200} className={"cursor-pointer"} priority={true} />
  } else {
    const userName = user?.username ?? "";
    imageElement = (
      <Avatar className={"cursor-pointer size-28"}>
        <AvatarImage src={userData?.avatar} alt={"User Image"} height="200px" width="200px" className={"size-28"} />
        <AvatarFallback>{userName}</AvatarFallback>
      </Avatar>
    );
  }

  if (showError) {
    toast(errorInfo.title, {
      description: errorInfo.message,
    })
  }

  return (
    <div className={"flex flex-col items-center gap-4"}>
      <Dialog open={iconOpen} onOpenChange={setIconOpen}>
        <DialogTrigger asChild>
          {imageElement}
        </DialogTrigger>
        <DialogContent className={"sm:max-w-[425px]"}>
          <DialogHeader>
            <DialogTitle>Update User Image</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Upload a new image for your user.
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
    </div>
  )
}