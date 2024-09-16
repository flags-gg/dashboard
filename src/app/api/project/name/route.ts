import {env} from "~/env";
import {NextResponse} from "next/server";

type UpdateProjectName = {
  name: string
  projectId: string
  sessionToken: string
  userId: string
}

export async function PUT(request: Request) {
  const { name, projectId, sessionToken, userId }: UpdateProjectName = await request.json() as UpdateProjectName

  try {
    const apiUrl = `${env.FLAGS_SERVER}/project/${projectId}`

    const respopnse = await fetch(apiUrl, {
      method : 'PUT',
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

    if (!respopnse.ok) {
      return NextResponse.json({ message: 'Failed to update project name' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Project name updated successfully' })
  } catch (e) {
    console.error('Failed to update project name', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
