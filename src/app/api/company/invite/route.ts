import { env } from "~/env";
import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";

type InviteUser = {
  name: string,
  email: string
}

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    throw new Error('No access token found');
  }

  const { name, email } = await req.json() as InviteUser;

  try {
    const res = await fetch(`${env.API_SERVER}/company/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
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
