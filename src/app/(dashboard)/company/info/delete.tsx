"use client"

import { deleteCookie } from "cookies-next";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useFlags } from "@flags-gg/react-library";

async function deleteCompany(): Promise<null | Error> {
  try {
    const response = await fetch(`/api/company/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      return new Error("Failed to delete company");
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return Error(`Failed to delete company: ${error.message}`);
    } else {
      console.error("deleteCompany", error);
    }
  }

  return new Error("Failed to delete company");
}

export default function DeleteButton() {
  const [openDelete, setOpenDelete] = useState(false);
  const {toast} = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {is} = useFlags();

  if (!is("company delete")?.enabled()) {
    return <></>
  }

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogTrigger asChild>
        <Button variant="destructive" className={"w-full cursor-pointer"}>
          Delete Company
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Company</DialogTitle>
          <DialogDescription>Are you sure you want to delete your company?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className={"cursor-pointer"} onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button variant="destructive" className={"cursor-pointer"} onClick={() => {
            setOpenDelete(false)
            deleteCompany().then(() => {
              toast({
                title: "Company deleted",
                description: "Your company has been deleted",
              });
              deleteCookie("hasCompletedOnboarding")
              queryClient.clear()
              router.push("/api/auth/signout")
            }).catch((error) => {
              if (error instanceof Error) {
                toast({
                  title: "Failed to delete company",
                  description: error.message,
                });
              } else {
                console.error("deleteCompany", error);
                toast({
                  title: "Failed to delete company",
                  description: "Failed to delete company",
                });
              }
            });
          }}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}