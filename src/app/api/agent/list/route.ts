import { NextResponse } from "next/server";
import { FlagAgent } from "~/lib/interfaces";
import { env } from "~/env";
import { getServerAuthSession } from "~/server/auth";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agents`, {
      method: 'GET',
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
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