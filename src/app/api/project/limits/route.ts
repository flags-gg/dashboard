import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { AgentLimits } from "~/lib/interfaces";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const {searchParams} = new URL(request.url);
  const project_id = searchParams.get('project_id');
  if (!project_id) {
    return NextResponse.json({ message: 'No project id provided' }, { status: 400 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/project/${project_id}/limits`, {
      method: 'GET',
      headers: {
        'x-user-subject': user.id,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch project limits' }, { status: 500 })
    }

    const data = await response.json() as AgentLimits
    if (data.allowed === 0) {
      return NextResponse.json({ message: 'No limits found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (e) {
    console.error('Failed to fetch project limits', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
