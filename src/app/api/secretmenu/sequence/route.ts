import {env} from "~/env";
import {NextResponse} from 'next/server';
import { getServerAuthSession } from "~/server/auth";

type SecretMenuParams = {
  menuId?: string
  environmentId?: string,
  sequence?: string[],
}

export async function PUT(request: Request) {
  const {menuId, sequence}: SecretMenuParams = await request.json();
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/secret-menu/${menuId}/sequence`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      body: JSON.stringify({
        "sequence": sequence
      }),
      cache: 'no-store',
    });
    if (!response.ok) {
      return NextResponse.json({message: "Failed to save secret menu sequence"}, { status: 500 });
    }

    return response
  } catch (error) {
    console.error('Error saving secret menu sequence:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const {sequence, environmentId}: SecretMenuParams = await request.json();
  const session = await getServerAuthSession();
  if (!session?.user?.access_token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/secret-menu/${environmentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': session.user.access_token,
        'x-user-subject': session.user.id,
      },
      cache: 'no-store',
      body: JSON.stringify({
        "sequence": sequence,
        "enabled": true,
      }),
    });
    if (!response.ok) {
      return NextResponse.json({message: "Failed to get secret menu"}, { status: 500 });
    }

    return response
  } catch (error) {
    console.error('Error getting secret menu:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
