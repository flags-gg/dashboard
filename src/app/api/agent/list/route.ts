import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { FlagAgent } from "~/lib/interfaces";
import { env } from "~/env";
import { logError } from "~/lib/logger";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': userId,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
    }

    const data = await response.json() as FlagAgent[]
    return NextResponse.json(data)
  } catch (e) {
    logError('Failed to fetch agents', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
