import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { UserDetails } from "~/hooks/use-user-details";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/user`, {
      method: 'GET',
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      console.info("user response", response, response.status)
      return NextResponse.json({ message: 'Failed to fetch user details' }, { status: 500 })
    }

    const data = await response.json() as UserDetails
    return NextResponse.json(data)
  } catch (e) {
    console.error('Failed to fetch user details', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT() {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/user`, {
      method: 'POST',
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to update user details' }, { status: 500 })
    }

    return NextResponse.json({ message: 'User details updated' })
  } catch (e) {
    console.error('Failed to update user details', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}