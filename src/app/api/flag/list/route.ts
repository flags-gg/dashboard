import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fetchFlags } from "~/app/api/flag/list/index";

type GetFlags = {
  environment_id: string
}

export async function POST(request: Request) {
  const { environment_id }: GetFlags = await request.json() as GetFlags
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const flags = await fetchFlags(environment_id, user.id)
    return NextResponse.json(flags)
  } catch (e) {
    console.error('Failed to fetch flags', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}