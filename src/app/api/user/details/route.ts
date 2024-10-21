import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";
import { env } from "~/env";

export async function GET(request: Request) {
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
      return NextResponse.json({ message: 'Failed to fetch user details' }, { status: 500 })
    }

    const data = await response.json() as { real_name: string, image: string }
    return NextResponse.json(data)
  } catch (e) {
    console.error('Failed to fetch user details', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}