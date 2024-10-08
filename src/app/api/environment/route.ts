import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";

export async function PUT(request: Request) {
  type UpdateEnvironmentName = {
    name: string
    environmentId: string
    enabled: boolean
  }

  const { name, environmentId, enabled }: UpdateEnvironmentName = await request.json() as UpdateEnvironmentName
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const apiUrl = `${env.API_SERVER}/environment/${environmentId}`
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      body: JSON.stringify({
        name: name,
        enabled: enabled,
        environment_id: environmentId
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to update environment name' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Environment name updated successfully' })
  } catch (e) {
    console.error('Failed to update environment name', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}