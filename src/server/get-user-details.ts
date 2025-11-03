import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import type { UserDetails } from "~/hooks/use-user-details";

/**
 * Server-side helper to fetch canonical user details from the API server.
 *
 * - Uses Clerk's server SDK to get the current user id
 * - Calls the backend API (`env.API_SERVER`), not the Next.js route, to avoid an extra hop
 * - Returns `null` if unauthenticated or if the backend returns a non-OK response
 */
export async function getUserDetailsServer(): Promise<UserDetails | null> {
  const user = await currentUser();
  if (!user) return null;

  try {
    const res = await fetch(`${env.API_SERVER}/user`, {
      method: "GET",
      headers: {
        "x-user-subject": user.id,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("getUserDetailsServer: backend returned non-OK", res.status, res.statusText);
      return null;
    }

    const data = (await res.json()) as UserDetails;
    return data ?? null;
  } catch (e) {
    console.error("getUserDetailsServer: error fetching user details", e);
    return null;
  }
}
