import {env} from "~/env";
import {NextResponse} from "next/server";

type CreateProject = {
  name: string
  sessionToken: string
  userId: string
}

export async function POST(request: Request) {
  const { name, sessionToken, userId }: CreateProject = await request.json() as CreateProject

  try {
    const apiUrl = `${env.API_SERVER}/project`

    const response = await fetch(apiUrl, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': sessionToken,
        'x-user-subject': userId,
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
