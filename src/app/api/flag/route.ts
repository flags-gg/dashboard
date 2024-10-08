import { NextResponse } from 'next/server';
import {env} from "~/env";
import {type Flag} from "~/lib/statemanager";
import { getServerAuthSession } from "~/server/auth";

type UpdateFlagRequest = {
  flag: Flag,
}

export async function POST(request: Request) {
  const { flag }: UpdateFlagRequest = await request.json();
  const session = await getServerAuthSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const apiUrl = `${env.API_SERVER}/flag/${flag.details.id}`;

    const response = await fetch(apiUrl, {
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
