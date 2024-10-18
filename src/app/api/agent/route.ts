import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  type DeleteAgent = {
    agentId: string
  }
  const { agentId }: DeleteAgent = await request.json() as DeleteAgent
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    throw new Error('No access token found')
  }

  try {
    const response = await fetch(`${env.API_SERVER}/agent/${agentId}`, {
      method: 'DELETE',
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to delete agent' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Agent deleted successfully' })
  } catch (e) {
    console.error('Failed to delete agent', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

