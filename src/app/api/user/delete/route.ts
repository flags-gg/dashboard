import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { env } from "~/env";

export async function DELETE() {
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/user`, {
      method: 'DELETE',
      headers: {
        'x-user-subject': user.id,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (e) {
    console.error('Failed to delete user', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}