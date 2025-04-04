import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { FlagAgent } from "~/lib/interfaces";
import { env } from "~/env";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch agents' }, { status: 500 })
    }

    const data = await response.json() as FlagAgent[]
    return NextResponse.json(data)
  } catch (e) {
    console.error('Failed to fetch agents', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}