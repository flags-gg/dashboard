import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { projectId, name }: { projectId: string, name: string } = await request.json() as { projectId: string, name: string }
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/project/${projectId}/agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      body: JSON.stringify({
        name: name,
        project_id: projectId,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to create agent' }, { status: 500 })
    }

    return NextResponse.json(await response.json())
  } catch (e) {
    console.error('Failed to create agent', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}