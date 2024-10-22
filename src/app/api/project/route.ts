import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { put, getProject } from "./project";

export async function DELETE(request: Request) {
  type DeleteProject = {
    projectId: string
  }

  const { projectId }: DeleteProject = await request.json() as DeleteProject
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/project/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to delete environment' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Environment deleted successfully' })
  } catch (e) {
    console.error('Failed to delete environment', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  return put(request)
}

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const projectId = searchParams.get('projectId')

  if (!projectId) {
    return NextResponse.json({ message: 'No projectId provided' }, { status: 400 })
  }
  const data = await getProject(projectId)
  if (!data) {
    return NextResponse.json({ message: 'No project found' }, { status: 404 })
  }

  return NextResponse.json(data)
}