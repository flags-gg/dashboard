import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { IProject } from "~/lib/interfaces";
import { env } from "~/env";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/projects`, {
      method: 'GET',
      headers: {
        'x-user-subject': user.id,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    const data = await response.json() as IProject[]
    return NextResponse.json(data)
  } catch (e) {
    console.error('Failed to fetch projects', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}