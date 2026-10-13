"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { toast } from "sonner";
import { logError } from "~/lib/logger";

async function setUpgraded(sessionId: string): Promise<void> {
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
    throw new Error(`Failed to set upgraded: ${res.status}`)
  }
}

function UpgradePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  // Sessions are single-use on the API, so confirm exactly once (not on every render).
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

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
  }, [sessionId, router])

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