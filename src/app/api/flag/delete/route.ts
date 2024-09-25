import { NextResponse } from "next/server";
import { env } from "~/env";

type DeleteFlag = {
  flag_id: string
  sessionToken: string
  userId: string
}

export async function DELETE(request: Request) {
  const { flag_id, sessionToken, userId }: DeleteFlag = await request.json() as DeleteFlag

  try {
    const apiUrl = `${env.API_SERVER}/flag/${flag_id}`

    const response = await fetch(apiUrl, {
      method : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': sessionToken,
        'x-user-subject': userId,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to delete flag' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Flag deleted successfully' })
  } catch (e) {
    console.error('Failed to delete flag', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}