import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { env } from "~/env";
import { put } from "./agent";
import { FlagAgent } from "~/lib/interfaces";


export async function DELETE(request: Request) {
  type DeleteAgent = {
    agentId: string
  }
  const { agentId }: DeleteAgent = await request.json() as DeleteAgent
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${agentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to delete agent' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Agent deleted successfully' })
  } catch (e) {
    console.error('Failed to delete agent', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
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
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${agentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      cache: 'no-store'
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch agent' }, { status: 500 })
    }

    const data = await response.json() as FlagAgent
    return NextResponse.json(data)
  } catch (e) {
    console.error('Failed to fetch agent', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}


