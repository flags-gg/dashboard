import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";
import { UserDetails } from "~/hooks/use-user-details";
import { env } from "~/env";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/company/users`, {
      method: 'GET',
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch company users' }, { status: 500 })
    }

    const data = await response.json() as UserDetails[]
    if (data.length === 0) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (e) {
    console.error('Failed to fetch company users', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}