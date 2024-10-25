import { env } from "~/env";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";

export async function PUT(request: Request) {
  const { domain }: { domain: string } = await request.json() as { domain: string }
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/company/user`, {
      method: 'PUT',
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain: domain
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to update company user' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Company user updated' })
  } catch (e) {
    console.error('Failed to update company user', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}