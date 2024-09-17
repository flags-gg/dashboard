import {env} from "~/env";
import {NextResponse} from "next/server";

type RequestLimits = {
  company_id: string
  sessionToken: string
  userId: string
}
export async function POST(request: Request) {
  const {sessionToken, userId}: RequestLimits = await request.json() as RequestLimits

  try {
    const apiUrl = `${env.API_SERVER}/company/limits`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-user-access-token': sessionToken,
        'x-user-subject': userId,
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
