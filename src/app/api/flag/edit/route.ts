import { env } from "~/env";
import { NextResponse } from "next/server";

type EditFlag = {
  flag_id: string
  sessionToken: string
  userId: string
  newName: string
}

export async function POST(request: Request) {
  const { flag_id, sessionToken, userId, newName }: EditFlag = await request.json() as EditFlag

  try {
    const apiUrl = `${env.API_SERVER}/flag/${flag_id}`

    const response = await fetch(apiUrl, {
      method : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': sessionToken,
        'x-user-subject': userId,
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