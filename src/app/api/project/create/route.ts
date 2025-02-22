import {env} from "~/env";
import {NextResponse} from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { currentUser } from "@clerk/nextjs/server";

type CreateProject = {
  name: string
}

export async function POST(request: Request) {
  const { name }: CreateProject = await request.json() as CreateProject
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/project`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      body: JSON.stringify({
        name: name,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to create project' }, { status: 500 })
    }

    return NextResponse.json(await response.json())
  } catch (e) {
    console.error('Failed to create project', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
