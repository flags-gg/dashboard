import { NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";
import {env} from "~/env";
import { authHeader, isFlagId, invalidId } from "~/server/api";
import {Flag} from "~/lib/interfaces";
import { logError } from "~/lib/logger";

type UpdateFlagRequest = {
  flag: Flag,
}

export async function POST(request: Request) {
  const { flag }: UpdateFlagRequest = await request.json();
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isFlagId(flag?.details?.id)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/flag/${encodeURIComponent(flag.details.id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
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
    logError('Error updating flag:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
