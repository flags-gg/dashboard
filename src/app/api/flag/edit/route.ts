import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";

type EditFlag = {
  flag_id: string
  newName: string
}

export async function POST(request: Request) {
  const { flag_id, newName }: EditFlag = await request.json() as EditFlag
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/flag/${flag_id}`, {
      method : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
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