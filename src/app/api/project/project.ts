import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {env} from "~/env";
import { IProject, ProjectsData} from "~/lib/interfaces";

export async function getProjects(userId: string): Promise<ProjectsData> {
  const res = await fetch(`${env.API_SERVER}/projects`, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-subject': userId,
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

  return getProjects(user.id)
}

export async function getProject(project_id: string): Promise<IProject | Error> {
  const user = await currentUser();
  if (!user) {
    return Error('No access token found')
  }

  try {
    const res = await fetch(`${env.API_SERVER}/project/${project_id}`, {
      headers: {
        'x-user-subject': user.id,
      },
      cache: 'no-store'
    })
    if (!res.ok) {
      return Error('Failed to fetch project')
    }

    return await res.json() as IProject
  } catch (e) {
    console.error('Failed to fetch project', e)
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
    throw new Error('No access token found')
  }

  try {
    const response = await fetch(`${env.API_SERVER}/project/${projectId}`, {
      method: 'PUT',
      headers: {
        'x-user-subject': user.id,
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
    console.error('Failed to update agent enabled status', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
