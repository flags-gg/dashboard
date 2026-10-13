import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { env } from "~/env";
import { authHeader, isUuid, invalidId } from "~/server/api";
import { logError } from "~/lib/logger";


export async function POST(request: Request) {
  const { projectId, name }: { projectId: string, name: string } = await request.json() as { projectId: string, name: string }
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(projectId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/project/${encodeURIComponent(projectId)}/agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      body: JSON.stringify({
        name: name,
        project_id: projectId,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
    }

    return NextResponse.json(await response.json())
  } catch (e) {
    logError('Failed to create agent', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}