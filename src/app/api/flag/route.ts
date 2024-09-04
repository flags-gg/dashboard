import { NextResponse } from 'next/server';
import {env} from "~/env";
import {type Flag} from "~/lib/statemanager";

type UpdateFlagRequest = {
  flag: Flag,
  sessionToken: string,
  userId: string,
}

export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { flag, sessionToken, userId }: UpdateFlagRequest = await request.json();

  try {
    const apiUrl = `${env.FLAGS_SERVER}/flag/${flag.details.id}`;

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': sessionToken,
        'x-user-subject': userId,
      },
      body: JSON.stringify({
        enabled: !flag.enabled,
        name: flag.details.name,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return new Error('Failed to update flag');
    }

    return NextResponse.json({ message: 'Flag updated successfully' });
  } catch (error) {
    console.error('Error updating flag:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
