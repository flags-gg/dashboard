import {type Session} from "next-auth";
import {type CompanyLimits} from "~/lib/statemanager";

export async function getCompanyLimits(session: Session): Promise<CompanyLimits | Error> {
  try {
    const res = await fetch(`/api/company/limits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.user.access_token}`,
      },
      body: JSON.stringify({
        sessionToken: session.user.access_token,
        userId: session.user.id,
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      console.error("Failed to fetch company limits", res.status, res.statusText);
      return new Error("Failed to fetch company limits")
    }

    return await res.json() as CompanyLimits
  } catch (e) {
    if (e instanceof Error) {
      return new Error(`Failed to fetch company limits: ${e.message}`)
    } else {
      console.error("failed to fetch company limits", e)
      return new Error("Failed to fetch company limits")
    }
  }
}
