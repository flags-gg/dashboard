import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {env} from "~/env";
import { authHeader, isUuid, invalidId } from "~/server/api";
import { IProject, ProjectsData} from "~/lib/interfaces";
import { logError } from "~/lib/logger";

export async function getProjects(): Promise<ProjectsData> {
  const res = await fetch(`${env.API_SERVER}/projects`, {
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeader()),
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  return res.json()
}

export async function fetchProjects(): Promise<ProjectsData> {
  const user = await currentUser();
  if (!user) {
    throw new Error('No access token found')
  }

  return getProjects()
}

export async function getProject(project_id: string): Promise<IProject | Error> {
  const user = await currentUser();
  if (!user) {
    return Error('No access token found')
  }

  if (!isUuid(project_id)) {
    return Error('Invalid project id')
  }

  try {
    const res = await fetch(`${env.API_SERVER}/project/${encodeURIComponent(project_id)}`, {
      headers: {
        ...(await authHeader()),
      },
      cache: 'no-store'
    })
    if (!res.ok) {
      return Error('Failed to fetch project')
    }

    return await res.json() as IProject
  } catch (e) {
    logError('Failed to fetch project', e)
    return Error('Internal Server Error')
  }
}

export async function put(request: Request) {
  type UpdateProjectName = {
    name: string
    projectId: string
    enabled: boolean
  }

  const {projectId, name, enabled}: UpdateProjectName = await request.json();
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(projectId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/project/${encodeURIComponent(projectId)}`, {
      method: 'PUT',
      headers: {
        ...(await authHeader()),
      },
      body: JSON.stringify({
        name: name,
        enabled: enabled,
        project_id: projectId
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({message: "Failed to update agent enabled status"}, { status: 500 })
    }

    return NextResponse.json({message: 'Agent enabled status updated successfully'})
  } catch (e) {
    logError('Failed to update agent enabled status', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
