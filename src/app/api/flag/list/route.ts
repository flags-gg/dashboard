import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { fetchFlags } from "~/app/api/flag/list/index";

type GetFlags = {
  environment_id: string
}

export async function POST(request: Request) {
  const { environment_id }: GetFlags = await request.json() as GetFlags
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const flags = await fetchFlags(environment_id, session.user.access_token, session.user.id)
    return NextResponse.json(flags)
  } catch (e) {
    console.error('Failed to fetch flags', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}