"use client"

import { Flag } from "~/lib/interfaces";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { BookUp2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { environmentAtom } from "~/lib/statemanager";
import { useAtom } from "jotai";
import { Spinner } from "~/components/ui/spinner";

async function promoteFlag(flag: Flag): Promise<null | Error>  {
  try {
    const res = await fetch("/api/flag/promote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flag_id: flag.details.id
      }),
      cache: "no-cache"
    })
    if (!res.ok) {
      return new Error("failed to promote")
    }

    return null
  } catch (error) {
    if (error instanceof Error) {
      return Error(`failed to promote flag: ${error.message}`);
    } else {
      console.error(error);
    }
  }

  return Error("Failed to promote flag")
}

export function PromoteFlag({flag}: {flag: Flag}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const environmentDetails = useAtom(environmentAtom)

  const promoteIt = () => {
    setLoading(true);
    try {
      promoteFlag(flag).then(() => {
        setLoading(true);
        router.refresh()
      }).catch((err) => {
        setError(err);
        return
      });
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Button asChild size={'icon'} variant={"outline"} className={"bg-muted/10 border-0"} disabled={true}>
        <Spinner />
      </Button>
    )
  }

  if (error) {
    toast("Failed to promote flag", {
      description: error,
    });

    return (
      <Button disabled={true} size={'icon'} variant={"outline"} className={"bg-muted/10 border-0 cursor-pointer"}>
        <BookUp2 className={"size-5"} />
      </Button>
    )
  }

  if (flag.details.promoted || !environmentDetails[0].canPromote) {
    return
  }

  return (
      <Button size={'icon'} variant={"outline"} className={"bg-muted/10 border-0 cursor-pointer"} onClick={promoteIt}>
        <BookUp2 className={"size-5"} />
      </Button>
  )
}