import {env} from "~/env";
import {type IProject, type ProjectsData} from "~/lib/statemanager";
import { getServerAuthSession } from "~/server/auth";
import { NextResponse } from "next/server";

export async function getProjects(): Promise<ProjectsData> {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  const res = await fetch(`${env.API_SERVER}/projects`, {
    headers: {
      'x-user-access-token': session.user.access_token,
      'x-user-subject': session.user.id,
    },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }
  return res.json()
}

export async function getProject(project_id: string): Promise<IProject | Error> {
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  try {
    const res = await fetch(`${env.API_SERVER}/project/${project_id}`, {
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
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
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  try {
    const response = await fetch(`${env.API_SERVER}/project/${projectId}`, {
      method: 'PUT',
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
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
