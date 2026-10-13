import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { authHeader, isUuid, invalidId } from "~/server/api";
import { put, getProject } from "./project";
import { logError } from "~/lib/logger";

export async function DELETE(request: Request) {
  type DeleteProject = {
    projectId: string
  }

  const { projectId }: DeleteProject = await request.json() as DeleteProject
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(projectId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/project/${encodeURIComponent(projectId)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (e) {
    logError('Failed to delete project', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  return put(request)
}

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {searchParams} = new URL(request.url)
  const projectId = searchParams.get('projectId')

  if (!projectId) {
    return NextResponse.json({ error: 'No projectId provided' }, { status: 400 })
  }
  if (!isUuid(projectId)) {
    return invalidId()
  }
  const data = await getProject(projectId)
  if (data instanceof Error) {
    return NextResponse.json({ error: data.message }, { status: 500 })
  }

  return NextResponse.json(data)
}