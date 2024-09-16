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
      return new Error("Failed to fetch company limits")
    }

    return await res.json() as CompanyLimits
  } catch (e) {
    return new Error("Failed to fetch company limits")
  }
}
