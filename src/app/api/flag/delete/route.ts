import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { authHeader, isFlagId, invalidId } from "~/server/api";
import { logError } from "~/lib/logger";

type DeleteFlag = {
  flag_id: string
}

export async function DELETE(request: Request) {
  const { flag_id }: DeleteFlag = await request.json() as DeleteFlag
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isFlagId(flag_id)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/flag/${encodeURIComponent(flag_id)}`, {
      method : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete flag' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Flag deleted successfully' })
  } catch (e) {
    logError('Failed to delete flag', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}