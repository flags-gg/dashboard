import {NextResponse} from 'next/server';
import { currentUser } from "@clerk/nextjs/server";

import {env} from "~/env";
import { logError } from "~/lib/logger";

type SecretMenuParams = {
  menuId: string,
  sequence?: string[],
}

export async function POST(request: Request) {
  const {menuId}: SecretMenuParams = await request.json();
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!menuId) {
    return NextResponse.json({message: "No Menu to retrieve"}, { status: 404 });
  }

  try {
    const response = await fetch(`${env.API_SERVER}/secret-menu/${menuId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      return NextResponse.json({message: "Failed to get secret menu"}, { status: 500 });
    }
    return response
  } catch (error) {
    logError('Error getting secret menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const {menu_id} = await request.json();
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/secret-menu/${menu_id}/state`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      return NextResponse.json({message: "Failed to update secret menu"}, { status: 500 });
    }

    return NextResponse.json({message: 'Secret menu updated successfully'})
  } catch (error) {
    logError('Error updating secret menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
