import { env } from "~/env";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";

type EditFlag = {
  flag_id: string
  newName: string
}

export async function POST(request: Request) {
  const { flag_id, newName }: EditFlag = await request.json() as EditFlag
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const apiUrl = `${env.API_SERVER}/flag/${flag_id}`

    const response = await fetch(apiUrl, {
      method : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      body: JSON.stringify({
        name: newName,
      }),
      cache: 'no-store',
      })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to edit flag' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Flag updated successfully' })
  } catch (e) {
    console.error('Failed to edit flag', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}