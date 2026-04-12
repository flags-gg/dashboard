import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { logError } from "~/lib/logger";

type EditFlag = {
  flag_id: string
  newName: string
}

export async function POST(request: Request) {
  const { flag_id, newName }: EditFlag = await request.json() as EditFlag
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      return NextResponse.json({ error: 'Failed to edit flag' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Flag updated successfully' })
  } catch (e) {
    logError('Failed to edit flag', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}