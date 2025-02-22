import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { IEnvironment } from "~/lib/interfaces";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/environments`, {
      method: 'GET',
      headers: {
        'x-user-subject': user.id,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch environments' }, { status: 500 })
    }

    const data = await response.json() as IEnvironment[]
    return NextResponse.json(data)
  } catch (e) {
    console.error('Failed to fetch environments', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}