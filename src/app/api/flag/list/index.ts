import { currentUser } from "@clerk/nextjs/server";
import { Flag } from "~/lib/interfaces";
import { env } from "~/env";

export async function fetchFlags(environment_id: string, userId: string): Promise<Flag[]> {
  const res = await fetch(`${env.API_SERVER}/environment/${environment_id}/flags`, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-subject': userId,
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch flags')
  }
  return res.json()
}

export async function getFlags(environment_id: string): Promise<Flag[]> {
  const user = await currentUser();
  if (!user) {
    throw new Error('No access token found')
  }

  return fetchFlags(environment_id, user.id)
}