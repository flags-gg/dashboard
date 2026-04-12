import {NextResponse} from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {env} from "~/env";
import { logError } from "~/lib/logger";

type CreateProject = {
  name: string
}

export async function POST(request: Request) {
  const { name }: CreateProject = await request.json() as CreateProject
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }

    return NextResponse.json(await response.json())
  } catch (e) {
    logError('Failed to create project', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
