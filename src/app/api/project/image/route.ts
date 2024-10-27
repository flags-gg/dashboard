import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  type UpdateImage = {
    project_id: string
    image: string
  }

  const {project_id, image}: UpdateImage = await request.json() as UpdateImage
  const session = await getServerAuthSession()
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  try {
    const response = await fetch(`${env.API_SERVER}/project/${project_id}/image`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      body: JSON.stringify({image: image}),
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to update project image' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Project image updated successfully' })
  } catch (e) {
    console.error('Failed to update project image', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}