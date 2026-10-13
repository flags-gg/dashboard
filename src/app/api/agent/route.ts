import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { env } from "~/env";
import { authHeader, isUuid, invalidId } from "~/server/api";
import { put } from "./agent";
import { FlagAgent } from "~/lib/interfaces";
import { logError } from "~/lib/logger";


export async function DELETE(request: Request) {
  type DeleteAgent = {
    agentId: string
  }
  const { agentId }: DeleteAgent = await request.json() as DeleteAgent
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(agentId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${encodeURIComponent(agentId)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Agent deleted successfully' })
  } catch (e) {
    logError('Failed to delete agent', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  return put(request)
}

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const agentId = searchParams.get('agentId')
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(agentId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${encodeURIComponent(agentId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      cache: 'no-store'
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 })
    }

    const data = await response.json() as FlagAgent
    return NextResponse.json(data)
  } catch (e) {
    logError('Failed to fetch agent', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


