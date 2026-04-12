"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { logError } from "~/lib/logger";

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
      logError("setUpgraded", e)
    }
  }

  return new Error("Failed to set upgraded")
}

function UpgradePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")

  setUpgraded(sessionId ?? "").then(() => {
    toast("Upgraded", {
      description: "Your plan has been upgraded",
    })
    router.push("/company")
  }).catch((e) => {
    logError("Failed to set upgraded", e)
    toast("Failed to upgrade", {
      description: "Failed to upgrade",
    })
    router.push("/company")
  })

  return <h1 className={"text-2xl font-semibold"}>Upgraded Plan</h1>
}

export default function Upgrade() {
  return (
    <div className={"grid grid-cols-3 gap-3"}>
      <header className={"col-span-3"}>
        <Suspense>
          <UpgradePage />
        </Suspense>
      </header>
    </div>
  )
}