import { NextResponse } from 'next/server';
import {env} from "~/env";
import {Flag} from "~/lib/interfaces";
import { getServerAuthSession } from "~/server/auth";

type UpdateFlagRequest = {
  flag: Flag,
}

export async function POST(request: Request) {
  const { flag }: UpdateFlagRequest = await request.json();
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/flag/${flag.details.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      body: JSON.stringify({
        enabled: !flag.enabled,
        name: flag.details.name,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({message: "Failed to update flag"}, { status: 500 });
    }

    return NextResponse.json({ message: 'Flag updated successfully' });
  } catch (error) {
    console.error('Error updating flag:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
