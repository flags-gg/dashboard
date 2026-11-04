import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { authHeader, isUuid } from "~/server/api";
import type { AgentFlags } from "~/lib/interfaces";

export async function getAgentFlags(agent_id: string): Promise<AgentFlags> {
  if (!(await currentUser())) {
    throw new Error('No access token found')
  }
  if (!isUuid(agent_id)) {
    throw new Error('Invalid agent id')
  }

  const res = await fetch(`${env.API_SERVER}/agent/${encodeURIComponent(agent_id)}/flags`, {
    headers: { ...(await authHeader()) },
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error('Failed to fetch flags')
  }
  return res.json() as Promise<AgentFlags>
}
