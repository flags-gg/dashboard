import {env} from "~/env";
import {type IProject, type ProjectsData} from "~/lib/statemanager";
import { getServerAuthSession } from "~/server/auth";

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
