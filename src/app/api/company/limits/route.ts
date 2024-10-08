import {env} from "~/env";
import {NextResponse} from "next/server";
import { getServerAuthSession } from "~/server/auth";

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const apiUrl = `${env.API_SERVER}/company/limits`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      return NextResponse.json({message: 'Failed to fetch company limits'}, {status: 500})
    }

    return NextResponse.json(await response.json())
  } catch (e) {
    console.error('Failed to fetch company limits', e)
    return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
  }
}
