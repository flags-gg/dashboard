"use client"

import { CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
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
import { useAtom } from "jotai";
import { hasCompletedOnboardingAtom } from "~/lib/statemanager";
import { deleteCookie } from "cookies-next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function deleteAccount(): Promise<null | Error> {
  try {
    const response = await fetch(`/api/user/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      return new Error("Failed to delete account");
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return Error(`Failed to delete account: ${error.message}`);
    } else {
      console.error("deleteAccount", error);
    }
  }

  return new Error("Failed to delete account");
}

export function InfoButtons() {
  const [openDelete, setOpenDelete] = useState(false);
  const [, setOnboardingComplete] = useAtom(hasCompletedOnboardingAtom)
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <CardFooter className="p-3 border-t-2 gap-2 items-center justify-center">
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogTrigger asChild>
          <Button variant="destructive" className={"w-full cursor-pointer"}>
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>Are you sure you want to delete your account?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className={"cursor-pointer"} onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button variant="destructive" className={"cursor-pointer"} onClick={() => {
              setOpenDelete(false)
              deleteAccount().then(() => {
                toast("Account deleted", {
                  description: "Your account has been deleted",
                });
                setOnboardingComplete(false)
                deleteCookie("hasCompletedOnboarding")
                queryClient.clear()
                router.push("/api/auth/signout")
              }).catch((error) => {
                if (error instanceof Error) {
                  toast("Failed to delete account", {
                    description: error.message,
                  });
                } else {
                  console.error("deleteAccount", error);
                  toast("Failed to delete account", {
                    description: "Failed to delete account",
                  });
                }
              });
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardFooter>
  );
}