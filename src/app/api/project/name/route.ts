import {env} from "~/env";
import {NextResponse} from "next/server";
import { getServerAuthSession } from "~/server/auth";

type UpdateProjectName = {
  name: string
  projectId: string
}

export async function PUT(request: Request) {
  const { name, projectId }: UpdateProjectName = await request.json() as UpdateProjectName
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const apiUrl = `${env.API_SERVER}/project/${projectId}`

    const respopnse = await fetch(apiUrl, {
      method : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      body: JSON.stringify({
        name: name,
      }),
      cache: 'no-store',
    })

    if (!respopnse.ok) {
      return NextResponse.json({ message: 'Failed to update project name' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Project name updated successfully' })
  } catch (e) {
    console.error('Failed to update project name', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
