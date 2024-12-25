import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/company/pricing`, {
      method: 'GET',
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch company limits' }, { status: 500 })
    }

    return NextResponse.json(await response.json())
  } catch (e) {
    console.error('Failed to fetch company limits', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}