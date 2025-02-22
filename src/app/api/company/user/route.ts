import { env } from "~/env";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { currentUser } from "@clerk/nextjs/server";

export async function PUT(request: Request) {
  const { domain, invite_code }: { domain: string, invite_code: string } = await request.json() as { domain: string, invite_code: string }
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/company/user`, {
      method: 'PUT',
      headers: {
        'x-user-subject': user.id,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain: domain,
        invite_code: invite_code,
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