import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { logError } from "~/lib/logger";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/company/pricing`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch company limits' }, { status: 500 })
    }

    return NextResponse.json(await response.json())
  } catch (e) {
    logError('Failed to fetch company limits', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}