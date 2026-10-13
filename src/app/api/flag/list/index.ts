import { currentUser } from "@clerk/nextjs/server";
import { Flag } from "~/lib/interfaces";
import { env } from "~/env";
import { authHeader, isUuid } from "~/server/api";

export async function fetchFlags(environment_id: string): Promise<Flag[]> {
  if (!isUuid(environment_id)) {
    throw new Error('Invalid environment id')
  }

  const res = await fetch(`${env.API_SERVER}/environment/${encodeURIComponent(environment_id)}/flags`, {
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader()),
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch flags')
  }

  const data = await res.json() as unknown;
  return Array.isArray(data) ? data as Flag[] : [];
}

export async function getFlags(environment_id: string): Promise<Flag[]> {
  const user = await currentUser();
  if (!user) {
    throw new Error('No access token found')
  }

  return fetchFlags(environment_id)
}
