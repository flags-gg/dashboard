import { NextResponse } from "next/server";
import { env } from "~/env";
import { getServerAuthSession } from "~/server/auth";

type DeleteFlag = {
  flag_id: string
}

export async function DELETE(request: Request) {
  const { flag_id }: DeleteFlag = await request.json() as DeleteFlag
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/flag/${flag_id}`, {
      method : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
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