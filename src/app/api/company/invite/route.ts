import { env } from "~/env";
import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

type InviteUser = {
  name: string,
  email: string
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { name, email } = await req.json() as InviteUser;

  try {
    const res = await fetch(`${env.API_SERVER}/company/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      body: JSON.stringify({
        name: name,
        email: email,
      }),
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to send invite' }, { status: 500 })
    }

    return NextResponse.json(null, { status: 200 })
  } catch (e) {
    console.error('Failed to send invite', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
