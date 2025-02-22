import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { ICompanyInfo } from "~/lib/interfaces";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/company`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch company info' }, { status: 500 })
    }

    return NextResponse.json(await response.json() as ICompanyInfo)
  } catch (e) {
    console.error('Failed to fetch company info', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}