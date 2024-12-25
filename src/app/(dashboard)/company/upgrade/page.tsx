"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "~/hooks/use-toast";

async function setUpgraded(sessionId: string): Promise<null | Error> {
  try {
    const res = await fetch(`/api/company/upgrade`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: sessionId,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      return new Error("Failed to set upgraded")
    }

    return null
  } catch (e) {
    if (e instanceof Error) {
      return Error(`Failed to set upgraded: ${e.message}`)
    } else {
      console.error("setUpgraded", e)
    }
  }

  return new Error("Failed to set upgraded")
}

export default function Upgrade() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const {toast} = useToast()

  setUpgraded(sessionId ?? "").then(() => {
    toast({
      title: "Upgraded",
      description: "Your plan has been upgraded",
    })
    router.push("/company")
  }).catch((e) => {
    console.error("Failed to set upgraded", e)
    toast({
      title: "Failed to upgrade",
      description: "Failed to upgrade",
    })
    router.push("/company")
  })


  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <h1 className={"text-2xl font-semibold"}>Upgraded Plan</h1>
      </header>
    </div>
  )
}