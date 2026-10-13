import {NextResponse} from 'next/server';
import { currentUser } from "@clerk/nextjs/server";
import {env} from "~/env";
import { authHeader, isUuid, invalidId } from "~/server/api";
import { logError } from "~/lib/logger";

type SecretMenuParams = {
  menuId?: string
  environmentId?: string,
  sequence?: string[],
}

export async function PUT(request: Request) {
  const {menuId, sequence}: SecretMenuParams = await request.json();
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(menuId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/secret-menu/${encodeURIComponent(menuId)}/sequence`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      body: JSON.stringify({
        "sequence": sequence
      }),
      cache: 'no-store',
    });
    if (!response.ok) {
      return NextResponse.json({message: "Failed to save secret menu sequence"}, { status: 500 });
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    logError('Error saving secret menu sequence:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const {sequence, environmentId}: SecretMenuParams = await request.json();
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(environmentId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/secret-menu/${encodeURIComponent(environmentId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      cache: 'no-store',
      body: JSON.stringify({
        "sequence": sequence,
        "enabled": true,
      }),
    });
    if (!response.ok) {
      logError("failed to create secret menu")
      return NextResponse.json({message: "Failed to create secret menu"}, { status: 500 });
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    logError('Error creating secret menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
