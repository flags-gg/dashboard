import { env } from "~/env";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";

export async function POST(request: Request) {
  const { companyName, companyDomain }: { companyName: string, companyDomain: string } = await request.json() as { companyName: string, companyDomain: string }
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/company`, {
      method: 'POST',
      headers: {
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: companyName,
        domain: companyDomain,
      }),
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to create company' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Company created' })
  } catch (e) {
    console.error('Failed to create company', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}