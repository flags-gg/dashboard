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
  } catch (error) {
    console.error('Error updating project name:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
